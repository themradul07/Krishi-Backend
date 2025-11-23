function generateCropCalendar(cropName, sowingDate) {
  const date = new Date(sowingDate);

  const events = [];

  if (cropName === "Wheat") {
    events.push({
      title: "First Irrigation",
      daysAfter: 20,
      type: "irrigation"
    });

    events.push({
      title: "Weed Control",
      daysAfter: 25,
      type: "pest"
    });

    events.push({
      title: "Fertilizer (Urea) Application",
      daysAfter: 40,
      type: "fertilizer"
    });

    events.push({
      title: "Final Irrigation",
      daysAfter: 80,
      type: "irrigation"
    });
  }

  return events.map(ev => ({
    ...ev,
    dueDate: new Date(date.getTime() + ev.daysAfter * 24 * 60 * 60 * 1000)
  }));
}

module.exports = { generateCropCalendar };
