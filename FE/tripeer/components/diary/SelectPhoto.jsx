"use client";

// 내부 모듈
import styles from "./selectPhoto.module.css";

const SelectPhoto = (props) => {
  const { selectedPhotos, selectAllPhotos, deleteGallery, saveSelectedPhotos } =
    props;
  return (
    <div className={styles.container}>
      <div className={styles.bottomBar}>
        <div
          className={styles.allSelectBtn}
          onClick={() => {
            selectAllPhotos();
          }}>
          전체 선택
        </div>
        <div className={styles.selectText}>
          {selectedPhotos.filter(Boolean).length}개의 사진이 선택됨
        </div>
        <div className={styles.rightBtnBox}>
          <div
            className={styles.deleteBtn}
            onClick={() => {
              deleteGallery();
            }}>
            선택 삭제
          </div>
          <div
            className={styles.saveBtn}
            onClick={() => {
              saveSelectedPhotos();
            }}>
            선택 저장
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPhoto;
