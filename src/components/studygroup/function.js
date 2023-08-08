import axios from "axios";

export function fetchData(url, setter, counter) {
    axios.get(url).then(response => {
        setter(response.data);

        if(counter !== undefined) {
            counter.current++;
        }
    });
}

function getOption(e) {
    let option = e.target.options[e.target.selectedIndex];
    let seq = parseInt(option.value);
    let name = option.text;

    return {seq: seq, name: name};
}

export function changeData(e, passName, setter) {
    let option = getOption(e);

    if(option.name === passName) return false;

    setter(option.seq);
}

export function changeDatas(e, passName, names, numbers, setNames, setNumbers) {
    let option = getOption(e);

    if(option.name === passName) return false;

    let newNames = [...names];
    let newNumbers = [...numbers];

    if(newNames.indexOf(option.name) === -1) {
        newNames.push(option.name);
        newNumbers.push(option.seq);
    } else {
        newNames.splice(newNames.indexOf(option.name), 1);
        newNumbers.splice(newNumbers.indexOf(option.seq), 1);
    }

    setNames(newNames);
    setNumbers(newNumbers);
}

export function toDate(date) {
    let dates = date.split("-");
    dates[1] = parseInt(dates[1]) - 1;

    return new Date(dates[0], dates[1], dates[2]);
}

export function isLogin() {
    return window.localStorage.getItem("userId") !== null;
}

export function goLogin() {
    alert("로그인이 필요한 기능입니다\n로그인 화면으로 이동합니다");
    window.location.href = "/login";
}

export function getLoginUserInfo() {
    if(!isLogin())  {
        return undefined;
    }

    let loginUserInfo = {
        userId: window.localStorage.getItem("userId"),
        fileName: window.localStorage.getItem("fileName")
    };

    return loginUserInfo;
}