import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import BuddyStart1 from "./info/BuddyStart1";
import BuddyStart2 from "./info/BuddyStart2";
import Buddy_Matching from "./matching/js/Buddy_Matching";
import BuddyWaiting from "./waiting/BuddyWaiting";
import BuddyAccept from "./accept/BuddyAccept";
import BuddySuccess from "./success/BuddySuccess";

export const Buddy = () => {
    const [serachParams, setSearchParams] = useSearchParams();

    const page = serachParams.get('buddy');

    useEffect(() => {
        if (!page) {
            setSearchParams({ page: 'start1' });
        }
    }, [page])

    let content;
    if (page === 'start1') {
        content = <BuddyStart1 />;
    } else if (page === 'start2') {
        content = <BuddyStart2 />;
    } else if (page === 'matching') {
        content = <Buddy_Matching />;
    } else if (page === 'waiting') {
        content = <BuddyWaiting />;
    } else if (page === 'accept') {
        content = <BuddyAccept />;
    } else if (page === 'success') {
        content = <BuddySuccess />;
    } else {
        content = <BuddyStart1 />; // Default 값으로 첫 페이지
    }

    return <>{content}</>;
}