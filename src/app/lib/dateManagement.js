import moment from "moment";

/**
 * Simple date comparison functions
 */

const reference = moment();

const today = reference.clone().startOf('day');
const twoDaysAhead = reference.clone().add(2, 'day').startOf('day');
const oneWeekAhead = reference.clone().add(7, 'day').startOf('day');

export function isToday(momentDate){
  return momentDate.isSame(today, 'd');
}

export function isTwoDaysComingOrLate(momentDate){
  return (isToday(momentDate) || momentDate.isAfter(today)) && momentDate.isBefore(twoDaysAhead);
}

export function isAWeekAhead(momentDate){
  return momentDate.isAfter(today) && momentDate.isBefore(oneWeekAhead);
}