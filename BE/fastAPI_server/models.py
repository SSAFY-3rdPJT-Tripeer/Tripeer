from sqlalchemy import Column, TEXT, INT, BIGINT, Integer, String, DECIMAL, ForeignKey, BigInteger, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# class Test(Base):
#     __tablename__ = "test"

#     id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
#     name = Column(TEXT, nullable=False)
#     number = Column(INT, nullable=False)
class SpotDetail(Base):
    __tablename__ = 'spot_detail'
    spot_info_id = Column(Integer, ForeignKey('spot_info.spot_info_id'), primary_key=True, autoincrement=True)
    cat1 = Column(String(3), nullable=False)
    cat2 = Column(String(5), nullable=False)
    cat3 = Column(String(9), nullable=False)
    created_time = Column(String(14), nullable=False)
    modified_time = Column(String(14), nullable=False)
    booktour = Column(String(5), nullable=False)    
    
class SpotDescription(Base):
    __tablename__ = "spot_description"
    spot_info_id = Column(Integer, ForeignKey('spot_info.spot_info_id'), primary_key=True )
    overview = Column(TEXT, nullable=False)
    summary = Column(TEXT, nullable=False)
    spot_info = relationship("SpotInfo", back_populates="descriptions")

class SpotInfo(Base):
    __tablename__ = 'spot_info'
    spot_info_id = Column(Integer, primary_key=True, autoincrement=True)
    city_id = Column(Integer, nullable=False)
    town_id = Column(Integer, nullable=False)
    content_type_id = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    addr1 = Column(String(100), nullable=False)
    addr2 = Column(String(50))
    zipcode = Column(String(50))
    tel = Column(String(50))
    first_image = Column(String(200))
    first_image2 = Column(String(200))
    readcount = Column(Integer)
    latitude = Column(DECIMAL(20, 17))
    longitude = Column(DECIMAL(20, 17))
    mlevel = Column(String(2))
    descriptions = relationship("SpotDescription", back_populates="spot_info")
    

class PlanBucket(Base):
    __tablename__ = 'plan_bucket'
    plan_bucket_id = Column(BigInteger, primary_key=True, autoincrement=True)
    plan_id = Column(BigInteger, nullable=False)
    spot_info_id = Column(Integer, nullable=False)
    user_id = Column(BigInteger, nullable=False)
    
    
class Wishlist(Base):
    __tablename__ = 'wishlist'
    wishlist_id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False)
    spot_info_id = Column(Integer, nullable=False)
    
class User(Base):
    __tablename__ = 'user'
    user_id = Column(BigInteger, primary_key=True, autoincrement=True)
    provider = Column(String(45), nullable=False)
    provider_id = Column(String(128), nullable=False)
    email = Column(String(45), nullable=False)
    nickname = Column(String(30), nullable=False)
    birth = Column(Date, nullable=True)
    profile_image = Column(String(255), nullable=True)
    role = Column(String(30), nullable=False)
    style1 = Column(String(45), nullable=True)
    style2 = Column(String(45), nullable=True)
    style3 = Column(String(45), nullable=True)
    is_online = Column(Boolean, nullable=False, default=False)
    
class PlanTown(Base):
    __tablename__ = 'plan_town'
    plan_town_id = Column(BigInteger, primary_key=True, autoincrement=True)
    plan_id = Column(BigInteger, nullable=False)
    city_id = Column(Integer, nullable=False)
    town_id = Column(Integer, nullable=False)
    city_only_id = Column(Integer, nullable=False)
    

class Coworker(Base):
    __tablename__ = 'coworker'
    coworker_id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('user.user_id'), nullable=False)
    plan_id = Column(BigInteger, ForeignKey('plan_town.plan_town_id'), nullable=False)
