import styles from "./onlineBox.module.css";
import { useState } from "react";

const OnlineBox = (props) => {
  const { members, online, myInfo } = props;
  const [onToggle, setOnToggle] = useState(false);
  const COLOR = [
    "#A60000",
    "#DE5000",
    "#D78E00",
    "#48B416",
    "#0065AE",
    "#20178B",
    "#65379F",
    "#F96976",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.onlines}>
        {online.map((member, idx) => {
          return member?.id !== myInfo.userId ? (
            <div
              key={idx}
              className={styles.img}
              style={{
                backgroundImage: `url(${member?.img})`,
                border: `3px solid ${member?.color}`,
              }}
            />
          ) : null;
        })}
      </div>
      <div
        className={styles.members}
        onClick={(e) => {
          if (e.currentTarget === e.target) setOnToggle(!onToggle);
        }}>
        <div
          className={styles.myImg}
          style={{
            backgroundImage: `url(${myInfo.profileImage})`,
            border: `3px solid ${COLOR[myInfo.order]}`,
          }}
          onClick={(e) => {
            if (e.currentTarget === e.target) setOnToggle(!onToggle);
          }}
        />
        <p
          className={styles.memberNum}
          onClick={(e) => {
            if (e.currentTarget === e.target) setOnToggle(!onToggle);
          }}>
          {members.length}
        </p>
        <div
          onClick={(e) => {
            if (e.currentTarget === e.target) setOnToggle(!onToggle);
          }}
          className={onToggle ? styles.onToggle : styles.offToggle}
        />
        {!onToggle ? null : (
          <div className={styles.others}>
            {members.map((member, idx) => {
              return (
                <div key={idx} style={{ width: "100%" }}>
                  <div className={styles.memberBox}>
                    <div className={styles.memberList}>
                      <div
                        className={styles.img}
                        style={{
                          backgroundImage: `url(${member.profileImage})`,
                          border: `3px solid ${COLOR[member.order]}`,
                        }}
                      />
                      <div className={styles.memberContent}>
                        <span className={styles.memberName}>
                          {member.nickname}
                        </span>
                        <p className={styles.isMe}>
                          {myInfo.userId === member.userId ? "me" : "other"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={
                        online.find((user) => user?.id === member.userId)
                          ? styles.online
                          : styles.offline
                      }
                    />
                  </div>
                  <hr className={styles.line} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineBox;
