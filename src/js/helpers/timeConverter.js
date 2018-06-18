const timeConverter = (time, zone) => {
    let zoneDiff = 2;
    if (zone === 'UTC+4') zoneDiff = 3;
    if (zone === 'UTC+5') zoneDiff = 4;
    if (zone === 'UTC+2') zoneDiff = 1;
    const timeArr = time.split('');
    const newTime = parseInt(timeArr[0] + timeArr[1], 10) - zoneDiff;
    return newTime + ':00';
}

export default timeConverter;