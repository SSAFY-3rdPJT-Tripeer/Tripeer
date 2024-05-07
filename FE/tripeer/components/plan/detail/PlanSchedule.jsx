"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as Y from "yjs";

import styles from "./PlanSchedule.module.css";
import flagSrc from "@/public/plan/flag.png";
import scheduleIcon from "@/public/plan/scheduleIcon.png";
import updateIcon from "@/public/plan/update.png";

import ScheduleItem from "@/components/plan/detail/schedule/scheduleItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CalculateBtn from "@/components/plan/detail/schedule/calculateBtn";
import ScheduleItem2 from "@/components/plan/detail/schedule/scheduleItem2";
import Time from "@/components/plan/detail/schedule/time";
import api from "@/utils/api";
import OnlineBox from "./OnlineBox";

const PlanSchedule = (props) => {
  const { myInfo, provider, plan, online } = props;
  const [userList, setUserList] = useState([]);
  // dnd를 관리할 전체 배열
  const [totalY, setTotalY] = useState(null);
  const [totalList, setTotalList] = useState([]);
  // 날짜를 저장
  const [day, setDay] = useState([]);
  // 위의 day 를 요일로 저장
  const [dayOfWeek, setDayOfWeek] = useState([]);
  const [members, setMembers] = useState([]);
  const [timeList, setTimeList] = useState(null);
  const [timeY, setTimeY] = useState(null);

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
      let sourceItems = totalY.get(sIdx);

      // 삭제할 값 미리 저장
      const tmp = sourceItems.get(source.index);

      // 아이템이 이동했으니 아이템 삭제
      sourceItems.delete(source.index, 1);

      // 이동한곳에 아이템 추가
      sourceItems.insert(destination.index, [tmp]);
      console.log("timeList", timeList);
      console.log("이동한곳 데이터들 ", sourceItems.toJSON());
    }

    // 다른 영역인 경우
    else {
      // 원래 있던곳의 배열 가져오기
      let sourceItems = totalY.get(sIdx);
      // 이동한 곳의 배열 가져오기
      let destinationItems = totalY.get(dIdx);

      // 옮길 데이터 임시 저장
      const tmp = sourceItems.get(source.index);

      // 원래 있던 배열에서 아이템 삭제
      sourceItems.delete(source.index, 1);
      // 이동한 배열에 추가
      destinationItems.insert(destination.index, [tmp]);
      console.log("이동한곳 데이터들 ", destinationItems.toJSON());
    }
  };

  const update = (saveYSpot, totalYList, timeYList) => {
    provider.doc.transact(() => {
      const arr = saveYSpot.toArray();
      const tArr = totalYList
        .toJSON()
        .flat()
        .map((e) => e.spotInfoId);

      const remain = arr.filter((e) => !tArr.includes(e.spotInfoId));

      if (remain.length !== 0) {
        const yItems = new Y.Array();
        const yTime = new Y.Array();

        // 만약에 스케쥴에 없는 장소가 있다 ?! >> 없는것 왼쪽 리스트에 추가해주기
        if (totalYList.length === 0) {
          yItems.insert(0, [...remain]);
          totalYList.insert(0, [yItems]);
          yTime.insert(0, []);
          timeYList.insert(0, [yTime]);

          for (let i = 0; i < day.length; i++) {
            const yItems = new Y.Array();
            yItems.insert(0, []);
            totalYList.insert(i + 1, [yItems]);
            const yTime = new Y.Array();
            yTime.insert(0, []);
            timeYList.insert(i + 1, [yTime]);
            console.log("업데이트");
          }
        } else {
          let leftArr = totalYList.get(0);
          if (remain.length !== 0) {
            // leftArr.push([...remain]);
            leftArr.insert(leftArr.length, [...remain]);
          }
        }

        const result = totalYList.toJSON();
        setTotalList(result);
        setTotalY(totalYList);
      } else if (totalYList.length !== 0) {
        const arr = saveYSpot.toJSON().map((e) => e.spotInfoId);
        const leftArr = totalYList.toJSON()[0];

        const result = leftArr.filter((e) => arr.includes(e.spotInfoId));

        const yItems = new Y.Array();

        yItems.insert(0, [...result]);

        totalYList.delete(0, 1);
        totalYList.insert(0, [yItems]);

        const result2 = totalYList.toJSON();
        setTotalList(result2);
        setTotalY(totalYList);
      }
    });
  };

  const getDay = async (saveYSpot, totalYList, timeYList) => {
    try {
      const res = await api.get("/plan");
      const planIdArr = res.data.data.filter((e) => e.planId === plan.planId);

      const start = planIdArr[0].startDay;
      const end = planIdArr[0].endDay;
      const arr = [];
      const dt = new Date(start);

      while (dt <= new Date(end)) {
        arr.push(new Date(dt).toISOString().slice(0, 10));
        dt.setDate(dt.getDate() + 1);
      }

      const result = arr.map(function (date) {
        return date.replace(/-/g, ".");
      });

      setDay(result);

      const sArr = saveYSpot.toArray();
      const tArr = totalYList
        .toJSON()
        .flat()
        .map((e) => e.spotInfoId);

      const remain = sArr.filter((e) => !tArr.includes(e.spotInfoId));

      provider.doc.transact(() => {
        const yItems = new Y.Array();
        const yTime = new Y.Array();

        // 만약에 스케쥴에 없는 장소가 있다 ?! >> 없는것 왼쪽 리스트에 추가해주기
        if (totalYList.length === 0) {
          yItems.insert(0, [...remain]);
          totalYList.insert(0, [yItems]);
          yTime.insert(0, []);
          timeYList.insert(0, [yTime]);

          for (let i = 0; i < result.length; i++) {
            const yItems = new Y.Array();
            yItems.insert(0, []);
            totalYList.insert(i + 1, [yItems]);
            const yTime = new Y.Array();
            yTime.insert(0, []);
            timeYList.insert(i + 1, [yTime]);
            console.log("데이", timeYList.toJSON());
          }

          console.log("생성 후", timeYList.toJSON());
        }
      });

      const getKoreanDayOfWeek = (dateString) => {
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        const date = new Date(dateString.replace(/\./g, "-"));
        const dayOfWeek = days[date.getDay()];
        return dayOfWeek;
      };

      const resultWeek = result.map(function (date) {
        return getKoreanDayOfWeek(date);
      });

      setDayOfWeek(resultWeek);
    } catch (e) {
      // console.log(e)
    }
  };

  useEffect(() => {
    if (myInfo && provider) {
      // yjs 에서 장소 데이터를 가져와서
      const saveYSpot = provider.doc.getArray("saveSpot");
      const totalYList = provider.doc.getArray("totalYList");
      const timeYList = provider.doc.getArray("timeYList");

      // totalYList.delete(0, totalYList.length);
      // timeYList.delete(0, timeYList.length);

      getDay(saveYSpot, totalYList, timeYList);

      update(saveYSpot, totalYList, timeYList);

      if (timeYList.length > 0) {
        setTimeList(timeYList.toJSON());
        setTimeY(timeYList);
      }

      timeYList.observeDeep(() => {
        console.log("timeYList 원본", timeYList.toJSON());
        const data = timeYList.toJSON();
        setTimeList(data);
        setTimeY(timeYList);
        console.log("옵저브딥 ");
        console.log("timeList 결과 ", data);
      });

      saveYSpot.observe(() => {
        // 추가했을때
        update(saveYSpot, totalYList, timeYList);
      });

      let timeoutId = null;

      totalYList.observeDeep(() => {
        // 이전 타임아웃이 있다면 취소
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // 100ms 후에 내부 코드 실행
        timeoutId = setTimeout(() => {
          setTotalList(totalYList.toJSON());
          setTotalY(totalYList);
        }, 10);
      });
    }
  }, [myInfo, provider]);

  useEffect(() => {
    if (timeList) {
      console.log("유즈이펙트 타임리스트", timeList);
    }
  }, [timeList]);

  useEffect(() => {
    setUserList(plan.coworkerList);
    // 날짜 가져오기
    // getDay();

    const getMember = async () => {
      const res = await api.get(`/plan/member/${plan.planId}`);
      setMembers(res.data.data);
    };

    if (plan) {
      getMember();
    }
  }, [plan]);

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
              return (
                <img
                  key={idx}
                  src={el.profileImage}
                  alt={""}
                  style={{ borderColor: COLOR[idx] }}
                />
              );
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
              <p className={styles.leftSectionP}>여행일정</p>
              <p className={styles.leftSectionP}>
                {day[0]}({dayOfWeek[0]}) - {day[day.length - 1]}(
                {dayOfWeek[dayOfWeek.length - 1]})
              </p>
              <Image
                className={styles.update}
                src={updateIcon}
                alt={""}
                width={18}
                height={18}
              />
              <OnlineBox members={members} online={online} myInfo={myInfo} />
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
                <section key={arrIdx} className={styles.scheduleSection}>
                  {/*일차 및 계산 버튼  */}
                  <header className={styles.scHeader}>
                    <div className={styles.scHeaderBox}>
                      <p className={styles.scP1}>{arrIdx}일차</p>
                      <p className={styles.scP2}>
                        {day[arrIdx - 1]}({dayOfWeek[arrIdx - 1]})
                      </p>
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
