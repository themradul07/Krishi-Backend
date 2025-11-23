// data/cropCalendarTemplate.js
module.exports = {
  Paddy: [
    { title: "1st Irrigation", days: 3, alertBefore: 1 },
    { title: "Fertilizer 1", days: 20, alertBefore: 2 },
    { title: "Weed Control", days: 30, alertBefore: 2 },
    { title: "Harvest", days: 90, alertBefore: 3 }
  ],

  Wheat: [
    { title: "Irrigation", days: 7, alertBefore: 2 },
    { title: "Fertilizer", days: 30, alertBefore: 3 },
    { title: "Harvest", days: 120, alertBefore: 4 }
  ]
};
