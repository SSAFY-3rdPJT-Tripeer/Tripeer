"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as Y from "yjs";

import styles from "./PlanSchedule.module.css";
import flagSrc from "@/public/plan/flag.png";
import scheduleIcon from "@/public/plan/scheduleIcon.png";

import ScheduleItem from "@/components/plan/detail/schedule/scheduleItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CalculateBtn from "@/components/plan/detail/schedule/calculateBtn";
import ScheduleItem2 from "@/components/plan/detail/schedule/scheduleItem2";
import Time from "@/components/plan/detail/schedule/time";
import api from "@/utils/api";
import apiLocal from "@/utils/apiLocal";
import OnlineBox from "./OnlineBox";
import ScheduleModal from "@/components/plan/detail/schedule/scheduleModal";
import LoadComponent from "@/components/loading/LoadComponent";
import Block from "@/components/plan/detail/schedule/block";
import MapRoute from "../MapRoute";

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
  const [blockList, setBlockList] = useState([]);
  const [blockY, setBlockY] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [option, setOption] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [cirIdx, setCirIdx] = useState(0);
  const [isSaveModal, setIsSaveModal] = useState(false);
  const [isRouteModal, setIsRouteModal] = useState(false);

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

  const onClickTime = (arrIdx, idx, opt, setLoaded) => {
    setLoaded(false);
    let timeoutId = null;
    console.log("option: ", option);

    // 이전 타임아웃이 있다면 취소
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 100ms 후에 내부 코드 실행
    timeoutId = setTimeout(() => {
      // let opt = 0;
      if (opt === "0") {
        opt = "1";
        setOption("1");
      } else {
        opt = "0";
        setOption("0");
      }
      const timeIdx = idx;
      const startId = totalList[arrIdx][idx];
      const endId = totalList[arrIdx][idx + 1];
      let timeArr = timeY.get(arrIdx);

      getTime(startId, endId, timeArr, timeIdx, "insert", opt, setLoaded);
    }, 600);
  };

  // 최단거리 계산 온클릭 이벤트
  const postData = async (option) => {
    setIsLoading(true);

    const data = {
      day: cirIdx,
      planId: plan.planId,
      option: option,
    };

    try {
      const res = await apiLocal.post("/node/opt", data);
      // console.log("넘겨준거", res.data.data);
      // const arr = totalY.get(cirIdx);
      // arr.delete(0, arr.length);
      // arr.insert(0, [...res.data.data.placeList]);
      // const time = timeY.get(cirIdx);
      // time.delete(0, time.length);
      // time.insert(0, [...res.data.data.spotTime]);

      if (res) {
        setIsLoading(false);
        setIsModal(false);
      }
    } catch (e) {
      if (e.response.status === 500) {
        setIsLoading(false);
        setIsModal(false);
        console.log("타임아웃");
      } else {
        console.log("최단거리 오류 ", e);
      }
    }
    // setTimeout(() => {
    //   setIsLoading(false);
    //   console.log("대따");
    //   setIsModal(false);
    // }, 5000);
  };

  const onClickCalculate = (arrIdx) => {
    blockY.delete(arrIdx, 1);
    blockY.insert(arrIdx, [true]);

    setCirIdx(arrIdx);
    setIsModal(!isModal);
  };

  const getTime = async (
    startId,
    endId,
    arr,
    index,
    type,
    option = "0",
    setLoaded = null,
  ) => {
    const placeList = [startId, endId];
    const data = {
      placeList: placeList,
      option: option,
    };
    try {
      const res = await api.post("/plan/optimizing/short", data);
      if (type === "insert") {
        arr.delete(index, 1);
      }
      const tmp = [...res.data.data.spotTime];
      tmp[0].push(res.data.data.publicRootList);
      arr.insert(index, [...tmp]);
      if (setLoaded != null) {
        setLoaded(true);
      }
    } catch (e) {
      console.log("시간 계산 GET 요청 실패: ", e);
      console.log("시간 계산 GET 요청 실패 타입: ", type);
    }
  };

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

    const isToBottom = source.index <= destination.index;

    // 같은 영역인 경우
    if (sIdx === dIdx) {
      let sourceItems = totalY.get(sIdx); // 장소배열
      let destinationItems = totalY.get(dIdx);
      if (source.index !== destination.index) {
        // --------------------------------------------------

        if (sIdx !== 0) {
          let timeArr = timeY.get(sIdx); // 타임 배열
          const i = source.index;
          if (timeArr.length !== 0) {
            // 원래 있던 곳이 맨앞(i == 0)인 경우
            if (i === 0) {
              //// 타임배열 i번을 지우고 앞으로 한칸씩 떙긴다
              timeArr.delete(i, 1);
              timeArr.insert(i, [0]);
            }

            // 원래 있던 곳이 끝(i == 장소배열.length-1)인 경`우
            else if (i === sourceItems.length - 1) {
              //// 타임배열에서 i-1번을 지운다
              timeArr.delete(i - 1, 1);
              timeArr.insert(i - 1, [0]);
            }

            // 원래 있던 곳이 중간(i)인 경우
            else {
              //// 타임배열에서 i번을 지우고, 앞으로 한칸씩 떙기고, 장소배열에서 i-1번과 i+1번 사이의 시간을 요청하고, 타임배열에서 i-1을 수정
              let arr1 = sourceItems.get(i - 1);
              let arr2 = sourceItems.get(i + 1);
              const startId = arr1;
              const endtId = arr2;
              if (isToBottom) {
                if (
                  destination.index - source.index > 1 &&
                  destination.index < destinationItems.length - 1
                ) {
                  timeArr.delete(i, 1);
                  getTime(startId, endtId, timeArr, i - 1, "insert");
                } else if (
                  source.index === destinationItems.length - 2 &&
                  destination.index === destinationItems.length - 1
                ) {
                  getTime(startId, endtId, timeArr, source.index - 1, "insert");
                } else {
                  timeArr.delete(i, 1);
                  timeArr.insert(i - 1, [0]);
                  getTime(startId, endtId, timeArr, i - 1, "insert");
                }
              } else {
                if (source.index === 1 && destination.index === 0) {
                  let arr4 = sourceItems.get(source.index);
                  const startId2 = arr4;
                  getTime(
                    startId2,
                    startId,
                    timeArr,
                    source.index - 1,
                    "insert",
                  );
                } else if (
                  source.index !== sourceItems.length - 1 &&
                  source.index - destination.index === 1
                ) {
                  let arr4 = sourceItems.get(destination.index - 1);
                  const startId2 = arr4;
                  let arr5 = sourceItems.get(source.index);
                  const startId3 = arr5;
                  getTime(
                    startId2,
                    startId3,
                    timeArr,
                    destination.index - 1,
                    "insert",
                  );
                } else {
                  timeArr.delete(i, 1);
                  timeArr.insert(i, [0]);
                  getTime(startId, endtId, timeArr, i, "insert");
                }
              }
            }
          }
        }

        //   넣기
        if (dIdx !== 0) {
          let timeArr = timeY.get(dIdx); // 타임 배열
          // 이동한곳에 하나 이상 있을때
          if (destinationItems.length > 0) {
            let i = destination.index;

            // if (source.index <= destination.indx) {
            //   i -= 1;
            //   k += 1;
            // }
            //// 앞에 추가하는 경우 (i == 0)
            if (destination.index === 0) {
              ////// 추가한 장소와 장소배열의 i번 장소의 시간을 계산하고, 타임배열의 i번에 삽입
              let arr1 = sourceItems.get(source.index);
              let arr2 = destinationItems.get(i);
              const startId = arr1;
              const endId = arr2;

              if (source.index === 1 && destination.index === 0) {
                let arr4 = sourceItems.get(source.index - 1);
                const startId2 = arr4;
                let arr5 = sourceItems.get(source.index + 1);
                const startId3 = arr5;
                getTime(startId2, startId3, timeArr, source.index, "insert");
              } else {
                getTime(startId, endId, timeArr, i, "create");
                if (!isToBottom) {
                  timeArr.delete(timeArr.length - 1, 1);
                }
              }
            }
            //// 끝에 추가하는 경우 (i == 장소배열.length)
            else if (destination.index === destinationItems.length - 1) {
              if (
                source.index === destinationItems.length - 2 &&
                destination.index === destinationItems.length - 1
              ) {
                let arr1 = sourceItems.get(source.index);
                let arr2 = destinationItems.get(destination.index);
                const startId = arr2;
                const endId = arr1;
                getTime(
                  startId,
                  endId,
                  timeArr,
                  destination.index - 1,
                  "insert",
                );
              } else {
                ////// 추가한 장소와 장소배열의 i-1번 장소의 시간을 계산하고, 타임배열의 i-1번에 추가
                let arr1 = sourceItems.get(source.index);
                let arr2 = destinationItems.get(i - 1);

                const startId = arr2;
                const endId = arr1;

                getTime(startId, endId, timeArr, i - 1, "add");
                if (isToBottom) {
                  timeArr.delete(0, 1);
                }
                if (!isToBottom) {
                  timeArr.delete(timeArr.length - 1, 1);
                }
              }
            }
            //// 중간에 추가하는 경우
            else {
              ////// 추가한 장소와 장소배열의 i-1번 장소의 시간을 계산하고 타임배열의 i-1번에 삽입
              let arr1 = sourceItems.get(source.index);
              let arr2 = null;

              if (isToBottom) {
                arr2 = destinationItems.get(destination.index);
              } else {
                arr2 = destinationItems.get(destination.index - 1);
              }
              const startId = arr1;
              const endId = arr2;

              if (!isToBottom) {
                if (
                  source.index !== sourceItems.length - 1 &&
                  source.index - destination.index === 1
                ) {
                  let arr4 = sourceItems.get(source.index);
                  const startId2 = arr4;
                  let arr5 = sourceItems.get(destination.index);
                  const startId3 = arr5;
                  getTime(
                    startId2,
                    startId3,
                    timeArr,
                    destination.index,
                    "insert",
                  );
                } else {
                  getTime(
                    endId,
                    startId,
                    timeArr,
                    destination.index - 1,
                    "insert",
                  );
                }
              } else {
                if (
                  destination.index - source.index > 1 &&
                  source.index !== 0
                ) {
                  getTime(
                    endId,
                    startId,
                    timeArr,
                    destination.index - 1,
                    "add",
                  );
                } else {
                  getTime(
                    endId,
                    startId,
                    timeArr,
                    destination.index - 1,
                    "insert",
                  );
                }
              }
              ////// 추가한 장소와 장소배열의 i번 장소의 시간을 계산하고, 타임배열 i번에 삽입
              let arr3 = null;
              let endId2 = null;
              if (isToBottom) {
                arr3 = destinationItems.get(destination.index + 1);
                endId2 = arr3;
                if (source.index === 0) {
                  getTime(startId, endId2, timeArr, i, "add");
                } else {
                  getTime(startId, endId2, timeArr, i, "insert");
                }
                if (source.index === 0) {
                  timeArr.delete(0, 1);
                }
              } else {
                if (
                  source.index !== sourceItems.length - 1 &&
                  source.index - destination.index === 1
                ) {
                  let arr4 = sourceItems.get(destination.index);
                  const startId2 = arr4;
                  let arr5 = sourceItems.get(source.index + 1);
                  const startId3 = arr5;
                  getTime(startId2, startId3, timeArr, source.index, "insert");
                } else {
                  arr3 = destinationItems.get(destination.index);
                  endId2 = arr3;
                  getTime(startId, endId2, timeArr, i, "add");
                  timeArr.delete(timeArr.length - 1, 1);
                }
              }
            }
          }
        }
      }

      // --------------------------------------------------

      // 삭제할 값 미리 저장
      const tmp = sourceItems.get(source.index);

      // 아이템이 이동했으니 아이템 삭제
      sourceItems.delete(source.index, 1);

      // 이동한곳에 아이템 추가
      sourceItems.insert(destination.index, [tmp]);
    }

    // 다른 영역인 경우
    else {
      // 원래 있던곳의 배열 가져오기
      let sourceItems = totalY.get(sIdx);
      // 이동한 곳의 배열 가져오기
      let destinationItems = totalY.get(dIdx); // 장소 배열

      // --------------------------------------------------

      if (sIdx !== 0) {
        let timeArr = timeY.get(sIdx); // 타임 배열
        const i = source.index;
        if (timeArr.length !== 0) {
          // 원래 있던 곳이 맨앞(i == 0)인 경우
          if (i === 0) {
            //// 타임배열 i번을 지우고 앞으로 한칸씩 떙긴다
            timeArr.delete(i, 1);
          }

          // 원래 있던 곳이 끝(i == 장소배열.length-1)인 경`우
          else if (i === sourceItems.length - 1) {
            //// 타임배열에서 i-1번을 지운다
            timeArr.delete(i - 1, 1);
          }

          // 원래 있던 곳이 중간(i)인 경우
          else {
            //// 타임배열에서 i번을 지우고, 앞으로 한칸씩 떙기고, 장소배열에서 i-1번과 i+1번 사이의 시간을 요청하고, 타임배열에서 i-1을 수정
            timeArr.delete(i, 1);
            let arr1 = sourceItems.get(i - 1);
            let arr2 = sourceItems.get(i + 1);
            const startId = arr1;
            const endtId = arr2;
            getTime(startId, endtId, timeArr, i - 1, "insert");
          }
        }
      }

      //   넣기
      if (dIdx !== 0) {
        let timeArr = timeY.get(dIdx); // 타임 배열
        // 이동한곳에 하나 이상 있을때
        if (destinationItems.length > 0) {
          const i = destination.index;
          //// 앞에 추가하는 경우 (i == 0)
          if (i === 0) {
            ////// 추가한 장소와 장소배열의 i번 장소의 시간을 계산하고, 타임배열의 i번에 삽입
            let arr1 = sourceItems.get(source.index);
            let arr2 = destinationItems.get(i);
            const startId = arr1;
            const endId = arr2;
            getTime(startId, endId, timeArr, i, "create");
          }
          //// 끝에 추가하는 경우 (i == 장소배열.length)
          else if (i === destinationItems.length) {
            ////// 추가한 장소와 장소배열의 i-1번 장소의 시간을 계산하고, 타임배열의 i-1번에 추가
            let arr1 = sourceItems.get(source.index);
            let arr2 = destinationItems.get(i - 1);

            const startId = arr2;
            const endId = arr1;

            getTime(startId, endId, timeArr, i - 1, "add");
          }
          //// 중간에 추가하는 경우
          else {
            ////// 추가한 장소와 장소배열의 i-1번 장소의 시간을 계산하고 타임배열의 i-1번에 삽입
            let arr1 = sourceItems.get(source.index);
            let arr2 = destinationItems.get(i - 1);
            const startId = arr2;
            const endId = arr1;

            getTime(startId, endId, timeArr, i - 1, "insert");
            ////// 추가한 장소와 장소배열의 i번 장소의 시간을 계산하고, 타임배열 i번에 삽입
            let arr3 = destinationItems.get(i);
            const endId2 = arr3;
            getTime(endId, endId2, timeArr, i, "add");
          }
        }
      }

      // --------------------------------------------------

      // 옮길 데이터 임시 저장
      const tmp = sourceItems.get(source.index);

      // 원래 있던 배열에서 아이템 삭제
      sourceItems.delete(source.index, 1);
      // 이동한 배열에 추가
      destinationItems.insert(destination.index, [tmp]);
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

  const getDay = async (saveYSpot, totalYList, timeYList, blockYList) => {
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
        if (totalYList.length <= 1) {
          if (totalYList.length === 0) {
            yItems.insert(0, [...remain]);
            totalYList.insert(0, [yItems]);
          }
          yTime.insert(0, []);
          timeYList.insert(0, [yTime]);
          blockYList.insert(0, [false]);

          for (let i = 0; i < result.length; i++) {
            const yItems = new Y.Array();
            yItems.insert(0, []);
            totalYList.insert(i + 1, [yItems]);
            const yTime = new Y.Array();
            yTime.insert(0, []);
            timeYList.insert(i + 1, [yTime]);
            blockYList.insert(0, [false]);
          }
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
      const blockYList = provider.doc.getArray("blockYList");

      // totalYList.delete(0, totalYList.length);
      // timeYList.delete(0, timeYList.length);
      // saveYSpot.delete(0, saveYSpot.length)

      getDay(saveYSpot, totalYList, timeYList, blockYList);

      update(saveYSpot, totalYList, timeYList);

      if (timeYList.length > 0) {
        setTimeList(timeYList.toJSON());
        setTimeY(timeYList);
      }

      if (blockYList.length > 0) {
        setBlockList(blockYList.toJSON());
        setBlockY(blockYList);
      }

      timeYList.observeDeep(() => {
        const data = timeYList.toJSON();
        setTimeList(data);
        setTimeY(timeYList);
      });

      blockYList.observe(() => {
        const data = blockYList.toJSON();
        setBlockList(data);
        setBlockY(blockYList);
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

  const saveData = async () => {
    try {
      const res = await api.post("/history/save", {
        totalYList: totalY.toJSON(),
        timeYList: timeY.toJSON(),
        planId: plan.planId,
      });

      if (res) {
        const text = provider.doc.getText("exit");
        text.insert(0, "exit");
      }
    } catch (e) {
      console.log("세이브 오류 ", e);
    }
    setIsSaveModal(false);
  };

  const cancelData = () => {
    setIsSaveModal(false);
  };

  return (
    // 화면 전체
    <div className={styles.container}>
      {isModal ? (
        <ScheduleModal
          isModal={isModal}
          setIsModal={setIsModal}
          setOption={setOption}
          postData={postData}
          cirIdx={cirIdx}
          day={day}
          totalList={totalList}
          blockY={blockY}
        />
      ) : null}
      {isLoading ? (
        <div className={styles.loadingModal}>
          <LoadComponent step={2} />
        </div>
      ) : null}
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
                  {/*{blockList[arrIdx] && <Block />}*/}
                  {/*일차 및 계산 버튼  */}
                  <header className={styles.scHeader}>
                    <div className={styles.scHeaderBox}>
                      <p className={styles.scP1}>{arrIdx}일차</p>
                      <p className={styles.scP2}>
                        {day[arrIdx - 1]}({dayOfWeek[arrIdx - 1]})
                      </p>
                    </div>
                    {/*  최단거리계산 버튼  */}
                    <CalculateBtn
                      onClickCalculate={onClickCalculate}
                      arrIdx={arrIdx}
                      blockList={blockList}
                    />
                  </header>
                  <Droppable
                    droppableId={`${arrIdx}`}
                    isDropDisabled={blockList[arrIdx]}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.divBox}>
                        {blockList[arrIdx] && <Block />}
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
                                    !snapshot.isDragging && (
                                      <Time
                                        arrIdx={arrIdx}
                                        idx={idx - 1}
                                        timeList={timeList}
                                        onClickTime={onClickTime}
                                      />
                                    )}
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
      <div
        className={styles.routeBox}
        onClick={() => {
          setIsRouteModal(true);
        }}>
        <div className={styles.routeIcon} />
        <p>경로보기</p>
      </div>
      <div
        className={styles.saveBox}
        onClick={() => {
          setIsSaveModal(true);
        }}>
        <div className={styles.saveIcon} />
        <p>저장하기</p>
      </div>
      {isSaveModal ? (
        <div
          className={styles.back}
          onClick={(e) => {
            e.currentTarget === e.target ? setIsSaveModal(false) : null;
          }}>
          <div className={styles.modalBox}>
            <p>해당 계획의 여행 일정을 저장하시겠습니까?</p>
            <div className={styles.modalBtns}>
              <div
                className={styles.cancelBtn}
                onClick={() => {
                  cancelData();
                }}>
                취소
              </div>
              <div
                className={styles.confirmBtn}
                onClick={() => {
                  saveData();
                }}>
                확인
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isRouteModal ? (
        <MapRoute daySpots={totalList} setIsRouteModal={setIsRouteModal} />
      ) : null}
    </div>
  );
};

export default PlanSchedule;
