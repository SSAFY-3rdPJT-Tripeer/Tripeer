"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./PlanSchedule.module.css";
import flagSrc from "@/public/plan/flag.png";
import scheduleIcon from "@/public/plan/scheduleIcon.png";
import updateIcon from "@/public/plan/update.png";

// 더미 데이터
import dummyUserList from "@/utils/dummyUserList";
import dummyPlaceList from "@/utils/dummyItem";
import ScheduleItem from "@/components/plan/detail/schedule/scheduleItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CalculateBtn from "@/components/plan/detail/schedule/calculateBtn";
import ScheduleItem2 from "@/components/plan/detail/schedule/scheduleItem2";
import Time from "@/components/plan/detail/schedule/time";

const PlanSchedule = () => {
  const [userList, setUserList] = useState([]);
  // const [placeList, setPlaceList] = useState([]);
  // dnd를 관리할 전체 배열
  const [totalList, setTotalList] = useState([]);

  // 아이템을 놓을때 실행
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // 이상한곳에 드롭되는경우
    if (!destination) {
      return;
    }

    // 가져온 영역
    const sIdx = +source.droppableId;
    // 옮긴 영역
    const dIdx = +destination.droppableId;

    // 같은 영역인 경우
    if (sIdx === dIdx) {
      // 전체 배열 가져오기
      let tList = [...totalList];
      // 원래 있던 곳의 배열 가져오기
      let sList = [...tList[sIdx]];
      // 전체 배열에서 수정할 배열 지우기
      tList.splice(sIdx, 1);

      // 옮길 데이터 임시 저장
      const tmp = sList[source.index];

      // 데이터가 원래 있던 곳에서 지우고
      sList.splice(source.index, 1);
      // 데이터가 이동한 곳에 넣기
      sList.splice(destination.index, 0, tmp);

      // 전체 배열에서 수정된 새 배열 원래 위치에 넣기
      tList.splice(dIdx, 0, sList);

      // 화면에 랜더링하느 전체 배열 갱신
      setTotalList(tList);
    }

    // 다른 영역인 경우
    // 다른 영역인 경우
    else {
      // 전체 배열 가져오기
      let tList = [...totalList];
      // 원래 있던 곳의 배열 가져오기
      let sList = [...tList[sIdx]];
      // 이동 한 곳의 배열 가져오기
      let dList = [...tList[dIdx]];

      // 옮길 데이터 임시 저장
      const tmp = sList[source.index];

      // 데이터가 원래 있던 곳에서 지우고
      sList.splice(source.index, 1);
      // 데이터가 이동한 곳에 넣기
      dList.splice(destination.index, 0, tmp);

      // 전체 배열에서 원래 있던 영역의 배열 지우기
      tList.splice(sIdx, 1);
      //전체 배열에서 원래 있던 곳의 배열 수정본 원래 위치에 넣기
      tList.splice(sIdx, 0, sList);

      // 전체 배열에서 이동한 영역의 배열 지우기
      tList.splice(dIdx, 1);
      // 전체 배열에서 이동한 곳의 배열 수정본 원래 위치에 넣기
      tList.splice(dIdx, 0, dList);

      // 화면에 랜더링하느 전체 배열 갱신
      setTotalList(tList);
    }
  };

  useEffect(() => {
    setUserList(dummyUserList);
    // setPlaceList(dummyPlaceList);
    // 임시로 더미 데이터를 넣음
    setTotalList([[...dummyPlaceList], [], [], [], []]);
  }, []);

  return (
    // 화면 전체
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        {/*  왼쪽 우리의 여행지 목록 전체 박스  */}
        <main className={styles.main}>
          {/*  우리의 여행지 목록 타이틀 박스  */}
          <section className={styles.titleBox}>
            <Image src={flagSrc} alt={""} width={15} height={18} />
            <p>우리의 여행지 목록</p>
          </section>
          <div className={styles.line} />
          {/*  유저 프사 박스  */}
          <section className={styles.userBox}>
            {userList.map((el, idx) => {
              return <img key={idx} src={el.img} alt={""} />;
            })}
          </section>
          <div className={styles.line} />
          {/*-----------------------------------------------------------------------------------*/}
          {/*  왼쪽 바디 */}
          {/*  목록 리스트  */}
          {/*dnd*/}
          {/*dnd 영역*/}
          {/*droppableId는 영역 아이디*/}
          <Droppable droppableId={"0"}>
            {(provided) => (
              <section
                className={`${styles.list} ${styles.scroll}`}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {totalList[0]?.map((el, idx) => {
                  return (
                    //   잡을 수 있는 아이템들
                    //   draggableId는 잡을 수 있는 아이템들의 아이디
                    //   index 는 onDragEnd 에서 result 값에 있는 source destination 의 인덱스 값
                    <Draggable
                      key={idx}
                      draggableId={`draggable-${0}-${idx}`}
                      index={idx}>
                      {(provided) => (
                        //   ref 를 줘야하기 때문에 div 로 한번 감싸서 dnd 속성들을 div 에 넣는데
                        <div
                          key={idx}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={styles.itemBox}>
                          <ScheduleItem data={el} />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        </main>
        {/*  오른쪽 플랜 일정 짜는 바디  */}
        {/*  오른쪽 일정 박스  */}
        {/*-----------------------------------------------------------------------------------*/}
        <main className={styles.mainRight}>
          {/*  오른쪽 헤더  */}
          <header className={styles.rightHeader}>
            {/*  헤더의 왼쪽 부분  */}
            <section className={styles.leftSection}>
              <Image src={scheduleIcon} alt={""} width={18} height={18} />
              <p>여행일정</p>
              <p>24.05.05(월) - 24.05.08(목)</p>
              <Image
                className={styles.update}
                src={updateIcon}
                alt={""}
                width={18}
                height={18}
              />
            </section>
            {/*  헤더의 오른쪽 부분  */}
          </header>
          <div className={styles.line2} />
          {/*  ---------------------------------------------------------------------------------*/}
          {/*  오른쪽 일정 관리 박스  */}
          <div
            className={`${styles.scheduleContainer} ${styles.scroll} ${styles.scrollX}`}>
            {/*  1번부터 드롭가능한 영역 생성  */}
            {totalList.map((el, arrIdx) => {
              return arrIdx === 0 ? null : (
                // 일차별 일정 컴포넌트
                <section className={styles.scheduleSection}>
                  {/*일차 및 계산 버튼  */}
                  <header className={styles.scHeader}>
                    <div className={styles.scHeaderBox}>
                      <p className={styles.scP1}>1일차</p>
                      <p className={styles.scP2}>24.05.05(월)</p>
                    </div>
                    {/*  최단거리계산 버튼  */}
                    <CalculateBtn />
                  </header>
                  <Droppable droppableId={`${arrIdx}`}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.divBox}>
                        {totalList[arrIdx].map((el, idx) => (
                          <Draggable
                            key={idx}
                            draggableId={`draggable-${arrIdx}-${idx}`}
                            index={idx}>
                            {(provided, snapshot) => (
                              <>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={
                                    snapshot.isDragging
                                      ? styles.draggingItem
                                      : styles.itemBox2
                                  }>
                                  {idx <= totalList[arrIdx].length - 1 &&
                                    idx !== 0 &&
                                    !snapshot.isDragging && <Time />}
                                  <ScheduleItem2 data={el} idx={idx} />
                                </div>
                                {snapshot.isDragging && (
                                  <div
                                    style={{
                                      height:
                                        provided.draggableProps.style.height,
                                    }}
                                    className={styles.placeholder}
                                  />
                                )}
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </section>
              );
            })}
          </div>
          {/*  ---------------------------------------------------------------------------------*/}
        </main>
      </DragDropContext>
    </div>
  );
};

export default PlanSchedule;
