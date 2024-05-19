"use client";

// 외부 모듈
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

// 내부 모듈
import styles from "./page.module.css";
import api from "@/utils/api";
import PhotoModal from "@/components/diary/PhotoModal";
import SelectPhoto from "@/components/diary/SelectPhoto";
import { downloadFile } from "@/utils/downloadFile";
import lottieJson from "@/components/diary/assets/emptyGallery.json";

const DayAlbum = () => {
  const router = useRouter();
  const params = useParams();
  const [gallery, setGallery] = useState({});
  const [clickId, setClickId] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isSelectModal, setIsSelectModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [planDayId, setPlanDayId] = useState(null);

  const getGallery = async (planDayId) => {
    const res = await api.get(`/history/gallery/${planDayId}`);
    setGallery(res.data.data);
    setSelectedPhotos(new Array(res.data.data.length).fill(false));
  };

  const postGallery = async (e, planDayId) => {
    if (e.target.files.length === 0) return;

    const files = e.target.files;

    if (!files) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        continue;
      }
      formData.append("images", file); // 'images'라는 이름으로 파일 추가
    }

    formData.append("images", files);
    await api.post(`/history/gallery/upload/${planDayId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    window.location.reload();
  };

  // 사진 선택 토글
  const togglePhotoSelection = (index) => {
    const newSelectedPhotos = [...selectedPhotos];
    if (newSelectedPhotos[index] === null) {
      newSelectedPhotos[index] = gallery[index].galleryId; // 선택 시 galleryId로 설정
    } else {
      newSelectedPhotos[index] = null; // 선택 해제 시 null로 설정
    }
    setSelectedPhotos(newSelectedPhotos);
  };

  // 전체 사진 선택 및 해제
  const selectAllPhotos = () => {
    if (selectedPhotos.every((id) => id !== null)) {
      setSelectedPhotos(new Array(gallery.length).fill(null)); // 모든 선택 해제
    } else {
      setSelectedPhotos(gallery.map((photo) => photo.galleryId)); // 모든 사진 선택
    }
  };

  // 선택된 사진 수 계산
  const countSelectedPhotos = () =>
    selectedPhotos.filter((id) => id !== null).length;

  const deleteGallery = async () => {
    const itemsToDelete = selectedPhotos.filter((id) => id !== null);
    if (itemsToDelete.length === 0) {
      alert("선택된 사진이 없습니다.");
      return;
    }
    try {
      await api.post(`/history/gallery/delete`, {
        galleryIdList: itemsToDelete,
      });
      setGallery((prevGallery) =>
        prevGallery.filter((photo) => !itemsToDelete.includes(photo.galleryId)),
      );
    } finally {
      setSelectedPhotos(new Array(gallery.length).fill(null));
    }
  };

  const saveSelectedPhotos = () => {
    const selectedGalleryIds = selectedPhotos.filter((id) => id !== null);
    if (selectedGalleryIds.length === 0) {
      alert("선택된 사진이 없습니다.");
      return;
    }
    selectedGalleryIds.forEach((id) => {
      const photo = gallery.find((photo) => photo.galleryId === id);
      if (photo && photo.img) {
        downloadFile(photo.img, `Photo-${id}.jpg`);
      }
    });
  };

  useEffect(() => {
    getGallery(params.id);
    setPlanDayId(params.id);
  }, []);

  useEffect(() => {
    if (!isSelectModal) {
      // isSelectModal이 false가 되면
      setSelectedPhotos(new Array(gallery.length).fill(null)); // 모든 사진 선택을 해제
    }
  }, [isSelectModal, gallery]);

  return (
    <main className={styles.container}>
      <header className={styles.albumHeader}>
        <div
          className={styles.backBox}
          onClick={() => {
            router.back();
          }}>
          <div className={styles.backIcon}></div>
          <div className={styles.backText}>2024.05.05(월)</div>
        </div>
        <div className={styles.albumBtnBox}>
          <div
            onClick={() => {
              setIsSelectModal((prev) => !prev);
            }}>
            {isSelectModal ? "선택 취소" : "사진 선택"}
          </div>
          <input
            className={styles.uploadInput}
            id="file"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              postGallery(e, planDayId);
            }}
          />
          <label className={styles.uploadBtn} htmlFor="file">
            사진 업로드
          </label>
        </div>
      </header>
      {gallery.length > 0 ? (
        <article className={styles.photoBox}>
          {Array.isArray(gallery) ? (
            gallery.map((photo, idx) => {
              return (
                <div
                  key={idx}
                  className={styles.photo}
                  onClick={() => {
                    if (!isSelectModal) {
                      setIsModal(true);
                      setClickId(photo.galleryId);
                    } else {
                      togglePhotoSelection(idx);
                    }
                  }}>
                  <div
                    style={{
                      backgroundImage: `url(${photo.img})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      height: "200px",
                      width: "100%",
                      position: "relative",
                    }}>
                    <div className={styles.userImgBox}>
                      <div
                        style={{
                          backgroundImage: `url(${photo.userImg})`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          height: "40px",
                          width: "40px",
                          borderRadius: "40px",
                        }}></div>
                    </div>

                    {isSelectModal && (
                      <div>
                        <div
                          className={styles.checkBox}
                          onClick={(e) => {
                            e.stopPropagation(); // 이벤트 버블링 방지
                            togglePhotoSelection(idx);
                          }}>
                          {selectedPhotos[idx] && (
                            <>
                              <div className={styles.check}></div>
                              <div className={styles.selectedBox}></div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </article>
      ) : (
        <div className={styles.emptyBox}>
          <div className={styles.emptyContent}>
            <Lottie
              className={styles.emptyImg}
              loop
              animationData={lottieJson}
              play
              style={{ width: 200, height: 200 }}
            />
            <div className={styles.emptyText}>즐거웠던 추억을 올려보세요.</div>
          </div>
        </div>
      )}
      {isModal && !isSelectModal ? (
        <PhotoModal
          gallery={gallery}
          clickId={clickId}
          setIsModal={setIsModal}
        />
      ) : (
        <></>
      )}
      {isSelectModal ? (
        <SelectPhoto
          photos={gallery}
          selectedPhotos={selectedPhotos}
          togglePhotoSelection={togglePhotoSelection}
          selectAllPhotos={selectAllPhotos}
          countSelectedPhotos={countSelectedPhotos}
          setIsSelectModal={setIsSelectModal}
          deleteGallery={deleteGallery}
          saveSelectedPhotos={saveSelectedPhotos}
        />
      ) : (
        <></>
      )}
    </main>
  );
};
export default DayAlbum;
