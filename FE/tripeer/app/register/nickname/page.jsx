"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import styles from "./page.module.css";
import useRegisterStore from "@/stores/register";

export default function NicknamePage() {
    const router = useRouter();

    const [text, setText] = useState("");
    const {nickName, setNickName} = useRegisterStore();

    const cancelOnClick = () => {
        router.back();
    };
    const inputOnChange = (e) => {
        setText(e.target.value);
    };

    const nextOnClick = () => {
        console.log('닉네임', nickName)
        setNickName(text);
    };

    return (
        <main className={styles.main}>
            <p className={styles.main_p}>닉네임을 입력해주세요.</p>
            <input
                className={styles.input}
                placeholder="10글자 내로 입력하세요."
                onChange={inputOnChange}
            />
            <section className={styles.center}>
                <div
                    className={`${styles.center} ${styles.cancel}`}
                    onClick={cancelOnClick}
                >
                    취소
                </div>
                <div
                    className={`${styles.center} ${styles.next}`}
                    onClick={nextOnClick}
                >
                    다음
                </div>
            </section>
        </main>
    );
}
