import { Timestamp } from 'firebase/firestore';


export function getElapsedTimeFromUTC(utcTimestamp) {
  const now = new Date();
  const date = utcTimestamp instanceof Timestamp ? utcTimestamp.toDate() : utcTimestamp;

  const elapsedMilliseconds = now - date;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const elapsedHours = elapsedMinutes / 60;
  const elapsedDays = elapsedHours / 24;
  const elapsedWeeks = elapsedDays / 7;
  const elapsedMonths = elapsedDays / 30.44;
  const elapsedYears = elapsedDays / 365.25;

  let result = "";

  if (elapsedMinutes < 60) {
    result = `${Math.floor(elapsedMinutes)} min`;
  } else if (elapsedHours < 24) {
    result = `${Math.floor(elapsedHours)} hora(s)`;
  } else if (elapsedDays < 7) {
    result = `${Math.floor(elapsedDays)} dia(s)`;
  } else if (elapsedWeeks < 4.5) {
    result = `${Math.floor(elapsedWeeks)} semana(s)`;
  } else if (elapsedMonths < 12) {
    result = `${Math.floor(elapsedMonths)} mês(s)`;
  } else {
    result = `${Math.floor(elapsedYears)} ano(s)`;
  }

  return result;
}
