"use client";

// 외부 모듈
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./page.module.css";
import api from "@/utils/api";
import PhotoModal from "@/components/diary/PhotoModal";
import SelectPhoto from "@/components/diary/SelectPhoto";
import { downloadFile } from "@/utils/downloadFile";

const DayAlbum = () => {
  const router = useRouter();
  const [gallery, setGallery] = useState({});
  const [clickId, setClickId] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isSelectModal, setIsSelectModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

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

  useEffect(() => {
    getGallery(8);
  }, []);

  useEffect(() => {
    if (!isSelectModal) {
      // isSelectModal이 false가 되면
      setSelectedPhotos(new Array(gallery.length).fill(null)); // 모든 사진 선택을 해제
    }
  }, [isSelectModal, gallery.length]);

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

    await api.post(`/history/gallery/delete`, {
      gallertIdList: itemsToDelete,
    });
    setGallery((prevGallery) =>
      prevGallery.filter((photo) => !itemsToDelete.includes(photo.galleryId)),
    );
  };

  const saveSelectedPhotos = () => {
    const selectedGalleryIds = selectedPhotos.filter((id) => id !== null);
    if (selectedGalleryIds.length === 0) {
      alert("선택된 사진이 없습니다.");
      console.log(`selectedGalleryIds가 없어요`);
      return;
    }
    selectedGalleryIds.forEach((id) => {
      const photo = gallery.find((photo) => photo.galleryId === id);
      if (photo && photo.img) {
        downloadFile(photo.img, `Photo-${id}.jpg`);
      }
    });
  };

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
              postGallery(e, 8);
            }}
          />
          <label className={styles.uploadBtn} htmlFor="file">
            사진 업로드
          </label>
        </div>
      </header>
      <article className={styles.photoBox}>
        {Array.isArray(gallery) ? (
          gallery.map((photo, idx) => {
            return (
              <div
                key={idx}
                className={styles.photo}
                onClick={() => {
                  setIsModal(true);
                  setClickId(idx);
                }}
                style={{ position: "relative" }}>
                <Image
                  src={photo.img}
                  loader={() => photo.img}
                  sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
                  fill
                  priority="false"
                  alt="memberImg"
                />
                <div
                  className={styles.userImgBox}
                  style={{ position: "relative" }}>
                  <Image
                    className={styles.userImg}
                    src={photo.userImg}
                    loader={() => photo.userImg}
                    sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
                    fill
                    priority="false"
                    alt="memberImg"
                  />
                </div>
                {isSelectModal && (
                  <div
                    className={styles.checkBox}
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      togglePhotoSelection(idx);
                    }}>
                    {selectedPhotos[idx] && (
                      <div className={styles.check}></div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <></>
        )}
      </article>
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