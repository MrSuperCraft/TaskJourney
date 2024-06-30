import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import FlameAnimation from "./BurningFlame";


export type StreakType = {
    /** Style props */
    propBackgroundColor?: CSSProperties["backgroundColor"];
    propBorder?: CSSProperties["border"];
    days: number;
};

const Streak: NextPage<StreakType> = ({
    propBackgroundColor,
    propBorder,
    days,
}) => {
    const streakWidgetLightStyle: CSSProperties = useMemo(() => {
        return {
            backgroundColor: propBackgroundColor,
            border: propBorder,
        };
    }, [propBackgroundColor, propBorder]);

    return (
        <div
            className={`flex flex-col items-center justify-center shadow-[0px_3px_1.3px_rgba(0,_0,_0,_0.25)] rounded-3xl bg-whitesmoke dark:bg-[#1b1b1b] box-border text-center text-3xl text-black dark:text-white font-inter border-[3px] border-solid border-gray-400 dark:border-gray-600 mt-10`}
            style={{ ...streakWidgetLightStyle, maxWidth: 200, maxHeight: 200, width: '100%', height: '100%', padding: 20 }}
        >
            <div className="relative shadow-[0px_3px_1.3px_rgba(0,_0,_0,_0.25)] rounded-3xl dark:bg-[#1b1b1b] box-border hidden border-[3px] border-solid border-gray-400 dark:border-gray-600" />
            <div className="flex flex-col items-center justify-center relative">
                <FlameAnimation />
                <h1 className="m-0 text-inherit font-bold">
                    Streak
                </h1>
                <b className="mt-1 text-2xl">
                    {days} Days
                </b>
            </div>
        </div>
    );
};

export default Streak;
