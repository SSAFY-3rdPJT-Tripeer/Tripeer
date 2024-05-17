from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine, func
from pydantic import BaseModel
from models import User, Wishlist, PlanBucket, SpotDescription, SpotInfo, PlanTown, Coworker
import pandas as pd
import torch
from typing import List
import numpy as np
from collections import Counter
from sentence_transformers import SentenceTransformer, util
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, ASCENDING


client = MongoClient("<mongoDB connetion String>")
mongodb = client.get_database('python')
collection = mongodb['recommend']

# 인덱스 생성
collection.create_index([('city_id', ASCENDING), ('town_id', ASCENDING), ('keyword', ASCENDING)], unique=True)

# 데이터 쓰기
def write_data(city_id, town_id, keyword, value):
    document = {
        'city_id': city_id,
        'town_id': town_id,
        'keyword': keyword,
        'value': value
    }
    collection.update_one(
        {'city_id': city_id, 'town_id': town_id, 'keyword': keyword},
        {'$set': document},
        upsert=True
    )

# 데이터 읽기
def read_data(city_id, town_id, keyword):
    document = collection.find_one({'city_id': city_id, 'town_id': town_id, 'keyword': keyword}, {'_id': 0, 'value': 1})
    return document['value'] if document else None

# 데이터베이스 연결 설정
USERNAME = 'root'
PASSWORD = '<mysql 비밀번호>'
HOST = '<mysql 서버주소>'
PORT = '<mysql 포트>'
DBNAME = 'tripeer'

DB_URL = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}'
engine = create_engine(DB_URL, pool_recycle=500)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용, 필요에 따라 도메인 리스트를 설정할 수 있습니다.
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 모델 로드
model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")




# 의존성 주입을 사용하여 데이터베이스 세션 관리
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic 모델
class Item(BaseModel):
    user_id: int
    city_id: int
    
class Item2(BaseModel):
    plan_id: int
    user_id: int


class SpotInfoResponse(BaseModel):
    spotInfoId: int
    title: str
    contentType: str
    addr: str
    latitude: float
    longitude: float
    img: str
    isWishlist: bool
    spot: bool
    recommended_comment: str
    keyword:str

class RecommendResponse(BaseModel):
    main : str
    sub : str
    spotItemList : List[SpotInfoResponse]
    
content_type_dic = {
    12: "관광지",
    14: "문화시설",
    15: "축제 공연 행사",
    25: "여행 코스",
    28: "레포츠",
    32: "숙박",
    38: "쇼핑",
    39: "음식점"
}

@app.post("/recommend/items/")
async def create_item(item: Item, db: Session = Depends(get_db)):
    user_id = item.user_id
    city_id = item.city_id
    town_id = -1
    if city_id == -1:
        coworker = db.query(Coworker).filter(Coworker.user_id == user_id).order_by(Coworker.coworker_id.desc()).first()
        if coworker:
            planTownList = db.query(PlanTown).filter(PlanTown.plan_id==coworker.plan_id).first()
            if planTownList.city_only_id:
                city_id = planTownList.city_only_id
                town_id = -1
            else:
                city_id = planTownList.city_id
                town_id = planTownList.town_id
        else:
            city_id = 39
            town_id = -1
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).all() 
    black_list = [el.spot_info_id for el in wishlist]
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_styles = [style for style in (user.style1, user.style2, user.style3) if style]
    
    embedding_path = f"csv/{city_id}/{town_id}/embedding.csv"
    loaded_df = pd.read_csv(embedding_path, delimiter=",", dtype=np.float32)
    loaded_tensor = torch.tensor(loaded_df.values)
    id_list = np.loadtxt(f"csv/{city_id}/{town_id}/id_list.csv", delimiter=",")
    
    print(user_styles)
    res = []
    top_k = 15
    for query in user_styles:
        query_embedding = model.encode(query, convert_to_tensor=True)
        cos_scores = util.pytorch_cos_sim(query_embedding, loaded_tensor)[0]
        cos_scores = cos_scores.cpu()
        top_results = np.argpartition(-cos_scores, range(top_k))[0:top_k]
        for idx in top_results[0:top_k]:
            if len(res) > 4:
                break
            if id_list[idx] not in black_list:
                res.append(["여행스타일", query, id_list[idx], cos_scores[idx]])
            
    res = sorted(res, key=lambda x: x[3], reverse=True)
    response_data = []
    for recommend in res:
        if len(response_data) > 2:
            break
        spot_info = db.query(SpotInfo).filter(SpotInfo.spot_info_id == int(recommend[2])).first()
        if spot_info:
            spot_info_res = SpotInfoResponse(
                spotInfoId=spot_info.spot_info_id,
                contentType=content_type_dic[spot_info.content_type_id],
                title=spot_info.title,
                addr=spot_info.addr1,
                img=spot_info.first_image,
                latitude=float(spot_info.latitude),
                longitude=float(spot_info.longitude),
                isWishlist=False,
                spot=False,
                recommended_comment=f"{recommend[0]}에서 찾은 키워드 '{recommend[1]}'과 관련된 관광지",
                keyword=recommend[1]
            )
            response_data.append(spot_info_res)
    return response_data

@app.post("/recommend/items2/")
async def create_item(item: Item2, db: Session = Depends(get_db)):
    plan_id = item.plan_id
    user_id = item.user_id

    user = db.query(User).filter(User.user_id == user_id).first()
    user_styles = [style for style in (user.style1, user.style2) if style]

    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()
    plan_town_list = db.query(PlanTown).filter(PlanTown.plan_id == plan_id).all()
    plan_bucket = db.query(PlanBucket).filter(PlanBucket.plan_id == plan_id).all()

    most_wish = (
        db.query(Wishlist.spot_info_id, func.count(Wishlist.spot_info_id).label('count'))
        .group_by(Wishlist.spot_info_id)
        .order_by(func.count(Wishlist.spot_info_id).desc())
        .first()
    )

    most_bucket = (
        db.query(PlanBucket.spot_info_id, func.count(PlanBucket.spot_info_id).label('count'))
        .group_by(PlanBucket.spot_info_id)
        .order_by(func.count(PlanBucket.spot_info_id).desc())
        .first()
    )

    # Pre-fetch all required SpotDescriptions
    spot_ids = {most_wish[0], most_bucket[0]}
    spot_ids.update([el.spot_info_id for el in wishlist])
    spot_ids.update([el.spot_info_id for el in plan_bucket])

    spot_descriptions = db.query(SpotDescription).filter(SpotDescription.spot_info_id.in_(spot_ids)).all()
    spot_desc_map = {desc.spot_info_id: desc for desc in spot_descriptions}

    most_wish_keyword = spot_desc_map[most_wish[0]].summary.split()[0]
    most_bucket_keyword = spot_desc_map[most_bucket[0]].summary.split()[0]

    wishlist_description = []
    wishlist_id_set = {el.spot_info_id for el in wishlist}
    for wish_item in wishlist:
        spot_description = spot_desc_map.get(wish_item.spot_info_id)
        if spot_description:
            wishlist_description.extend(spot_description.summary.split())

    bucket_description = []
    bucket_id_set = {el.spot_info_id for el in plan_bucket}
    for bucket_item in plan_bucket:
        spot_description = spot_desc_map.get(bucket_item.spot_info_id)
        if spot_description:
            bucket_description.extend(spot_description.summary.split())
            
    keywordBlackList = [most_bucket_keyword, most_wish_keyword, user_styles]        

    wishlist_top_two = [item for item, _ in Counter(wishlist_description).most_common(6) if item not in keywordBlackList][:2]
    keywordBlackList += wishlist_top_two
    
    bucket_top_two = [item for item, _ in Counter(bucket_description).most_common(8) if item not in keywordBlackList][:2]

    black_list = wishlist_id_set.union(bucket_id_set)

    res = {
        'wishlist1': [],
        'wishlist2': [],
        'bucket1': [],
        'bucket2': [],
        'style1': [],
        'style2': [],
        'hotbucket': [],
        'hotwish': []
    }

    keyword_dict = {
        'wishlist1': (wishlist_top_two[0] if len(wishlist_top_two) > 0 else ""),
        'wishlist2': (wishlist_top_two[1] if len(wishlist_top_two) > 1 else ""),
        'bucket1': (bucket_top_two[0] if len(bucket_top_two) > 0 else ""),
        'bucket2': (bucket_top_two[1] if len(bucket_top_two) > 1 else ""),
        'style1': user_styles[0],
        'style2': (user_styles[1] if len(user_styles) == 2 else ""),
        'hotbucket': most_bucket_keyword,
        'hotwish': most_wish_keyword
    }

    print(keyword_dict)
    
    for el in plan_town_list:
        city_id = el.city_only_id if el.city_only_id else el.city_id
        town_id = -1 if el.city_only_id else el.town_id

        embedding_path = f"csv/{city_id}/{town_id}/embedding.csv"
        loaded_df = pd.read_csv(embedding_path, delimiter=",", dtype=np.float32)
        loaded_tensor = torch.tensor(loaded_df.values)
        id_list = np.loadtxt(f"csv/{city_id}/{town_id}/id_list.csv", delimiter=",")

        for i, wishlist_keyword in enumerate(wishlist_top_two):
            mongodb_data = read_data(city_id, town_id, wishlist_keyword)
            if mongodb_data:
                res[f'wishlist{i+1}'].extend(mongodb_data)

        for i, bucket_keyword in enumerate(bucket_top_two):
            mongodb_data = read_data(city_id, town_id, bucket_keyword)
            if mongodb_data:
                res[f'bucket{i+1}'].extend(mongodb_data)

        for i, style_keyword in enumerate(user_styles):
            mongodb_data = read_data(city_id, town_id, style_keyword)
            if mongodb_data:
                res[f'style{i+1}'].extend(mongodb_data)
        
        
        mongodb_data = read_data(city_id, town_id, most_wish_keyword)
        if mongodb_data:
            res['hotwish'].extend(mongodb_data)
            
        mongodb_data = read_data(city_id, town_id, most_bucket_keyword)
        if mongodb_data:
            res['hotwish'].extend(mongodb_data)
    
    
    final_data = []
    for key, value in res.items():
        if value:
            response_data = []
            value = sorted(value, key=lambda x: x[1], reverse=True)
            for el in value[:15]:
                if el[0] in black_list:
                    continue
                spot_info = db.query(SpotInfo).filter(SpotInfo.spot_info_id == int(el[0])).first()
                
                if spot_info:
                    spot_info_res = SpotInfoResponse(
                        spotInfoId=spot_info.spot_info_id,
                        contentType=content_type_dic.get(spot_info.content_type_id, "Unknown"),
                        title=spot_info.title,
                        addr=spot_info.addr1,
                        img=spot_info.first_image,
                        latitude=float(spot_info.latitude),
                        longitude=float(spot_info.longitude),
                        isWishlist=False,
                        spot=False,
                        recommended_comment=f"{key}에서 찾은 키워드 '{keyword_dict[key]}'과 관련된 관광지",
                        keyword=str(keyword_dict[key])
                    )
                    response_data.append(spot_info_res)
            recommend_response = RecommendResponse(
                main=keyword_dict[key],
                sub=key,
                spotItemList=response_data
            )
            final_data.append(recommend_response)

    return final_data
