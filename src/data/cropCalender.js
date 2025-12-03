// data/cropCalendarTemplate.js
module.exports = {
  Paddy: [
    { title: "Nursery preparation", days: 0, alertBefore: 2, advice: "Prepare raised nursery beds, use certified seed, and ensure good drainage." },
    { title: "Seed sowing / transplanting", days: 15, alertBefore: 3, advice: "Sow or transplant with recommended spacing; avoid waterlogging on the first 2–3 days." },
    { title: "1st Irrigation", days: 3, alertBefore: 1, advice: "Maintain shallow water depth to help seedlings establish without lodging." },
    { title: "1st Fertilizer (basal)", days: 7, alertBefore: 2, advice: "Apply basal NPK based on soil test; incorporate into moist soil, not standing water." },
    { title: "Weed control 1", days: 20, alertBefore: 3, advice: "Use cono weeder or hand weeding; avoid herbicide spray if rain is predicted." },
    { title: "Top dressing 1 (tillering)", days: 25, alertBefore: 2, advice: "Apply nitrogen when tillers start forming; keep 2–3 cm water after application." },
    { title: "Pest & disease scouting", days: 35, alertBefore: 2, advice: "Inspect for BPH, leaf folder, and blast; use yellow sticky traps and report outbreaks." },
    { title: "Top dressing 2 (panicle initiation)", days: 45, alertBefore: 3, advice: "Apply recommended N and K; avoid excess nitrogen to reduce lodging risk." },
    { title: "Weed control 2", days: 45, alertBefore: 2, advice: "Remove late weeds to reduce competition and pest harboring." },
    { title: "Pre-harvest check", days: 80, alertBefore: 4, advice: "Check grain hardening and moisture; plan harvest in a dry weather window." },
    { title: "Harvest", days: 90, alertBefore: 3, advice: "Harvest when 80–85% grains are golden-yellow; avoid lodging by draining water 7 days before." }
  ],

  Banana: [
    { title: "Pit preparation & planting", days: 0, alertBefore: 3, advice: "Dig pits with FYM and lime if needed; plant healthy suckers or tissue culture plants." },
    { title: "1st Fertilizer application", days: 30, alertBefore: 3, advice: "Apply NPK in ring around the plant, cover lightly with soil, irrigate well." },
    { title: "Desuckering & propping", days: 60, alertBefore: 3, advice: "Remove unwanted suckers and prop plants in windy areas to prevent lodging." },
    { title: "2nd Fertilizer application", days: 90, alertBefore: 3, advice: "Top dress based on schedule; add organic manure or compost if available." },
    { title: "Bunch emergence care", days: 150, alertBefore: 5, advice: "Remove male bud if recommended, provide support, and keep bunch clean and covered if needed." },
    { title: "Pest & sigatoka monitoring", days: 120, alertBefore: 4, advice: "Check leaves for sigatoka spots and pseudostem borers; avoid overhead irrigation late evening." },
    { title: "Harvest", days: 240, alertBefore: 5, advice: "Harvest when fingers are full and angles rounded; avoid damage to bunch while cutting." }
  ],

  Coconut: [
    { title: "Basal manure & fertilizer", days: 0, alertBefore: 7, advice: "Apply FYM and NPK in basins around palms at the onset of monsoon." },
    { title: "Mulching & moisture conservation", days: 30, alertBefore: 5, advice: "Mulch basins with dry leaves or husk to conserve moisture in dry months." },
    { title: "Crown cleaning & sanitation", days: 60, alertBefore: 5, advice: "Remove dried fronds and diseased nuts to reduce pest and disease incidence." },
    { title: "Rhinoceros beetle & red palm weevil check", days: 90, alertBefore: 5, advice: "Inspect crown; apply recommended traps or bio-agents if damage is seen." },
    { title: "Irrigation scheduling", days: 120, alertBefore: 5, advice: "Ensure life-saving irrigation in long dry spells to sustain nut setting." },
    { title: "Harvest round", days: 150, alertBefore: 7, advice: "Plan harvest based on market demand; avoid dropping nuts directly on ground." }
  ],

  Pepper: [
    { title: "Planting / gap filling", days: 0, alertBefore: 5, advice: "Plant healthy vines near live standards at onset of monsoon; ensure good drainage." },
    { title: "Training & pruning of vines", days: 60, alertBefore: 5, advice: "Train vines around standards and remove unwanted shoots for good canopy." },
    { title: "1st Fertilizer & mulch", days: 90, alertBefore: 5, advice: "Apply NPK and organic manure in basins; mulch with dry leaves to conserve moisture." },
    { title: "Shade regulation", days: 120, alertBefore: 5, advice: "Prune standards to maintain optimum filtered light for pepper vines." },
    { title: "Pest & quick wilt monitoring", days: 150, alertBefore: 5, advice: "Inspect for wilt symptoms and pollu beetle; avoid water stagnation around vines." },
    { title: "Berry maturity check", days: 210, alertBefore: 7, advice: "Harvest spikes when berries turn from green to light red for quality black pepper." }
  ],

  Rubber: [
    { title: "Rain-guarding preparation", days: 0, alertBefore: 7, advice: "Install rain-guards before monsoon to reduce tapping days lost due to rain." },
    { title: "Start tapping season", days: 30, alertBefore: 5, advice: "Begin tapping when trees reach recommended girth; follow proper panel and cut practice." },
    { title: "Fertilizer application", days: 60, alertBefore: 7, advice: "Apply recommended fertilizer around tree, mix with soil, avoid root injury." },
    { title: "Panel inspection & rest", days: 120, alertBefore: 7, advice: "Check for panel dryness or brown bast; give rest period if over-tapped." },
    { title: "Weed & cover crop management", days: 150, alertBefore: 7, advice: "Slashing weeds and maintaining cover crops help conserve soil and moisture." }
  ],

  Tapioca: [
    { title: "Land preparation & planting", days: 0, alertBefore: 3, advice: "Prepare ridges and plant healthy setts at correct spacing in moist soil." },
    { title: "Gap filling", days: 20, alertBefore: 3, advice: "Replace missing plants early to maintain uniform stand." },
    { title: "1st Fertilizer application", days: 30, alertBefore: 3, advice: "Apply recommended NPK dose and earth up plants for better root development." },
    { title: "Weed control & earthing up", days: 45, alertBefore: 3, advice: "Control weeds and provide earthing up to prevent lodging and expose tubers less." },
    { title: "Pest and mite check", days: 75, alertBefore: 3, advice: "Monitor for mealy bugs and mites; remove heavily infested tops and use recommended controls." },
    { title: "Harvest", days: 240, alertBefore: 7, advice: "Harvest at recommended age for your variety; avoid leaving tubers too long in very wet soil." }
  ],

  Ginger: [
    { title: "Seed rhizome treatment & planting", days: 0, alertBefore: 3, advice: "Treat rhizomes against fungal diseases and plant in raised beds with good drainage." },
    { title: "Mulching after planting", days: 3, alertBefore: 1, advice: "Mulch with green leaves or straw to conserve moisture and suppress weeds." },
    { title: "1st Fertilizer & earthing up", days: 45, alertBefore: 3, advice: "Apply fertilizer and earth up soil around clumps to support rhizome growth." },
    { title: "Weed control", days: 60, alertBefore: 3, advice: "Remove weeds manually; avoid deep hoeing near rhizomes." },
    { title: "Rhizome rot & shoot borer check", days: 90, alertBefore: 4, advice: "Inspect for yellowing and rotting; improve drainage and use recommended biocontrols." },
    { title: "Harvest (green ginger)", days: 210, alertBefore: 7, advice: "Harvest when leaves start yellowing and rhizomes attain market size." }
  ],

  Turmeric: [
    { title: "Rhizome treatment & planting", days: 0, alertBefore: 3, advice: "Use healthy rhizomes, treat against rot, and plant on raised beds at onset of rains." },
    { title: "Mulching", days: 3, alertBefore: 1, advice: "Apply thick mulch to conserve moisture and suppress early weeds." },
    { title: "1st Fertilizer & earthing up", days: 45, alertBefore: 3, advice: "Top dress with NPK and earth up to encourage rhizome expansion." },
    { title: "Weed & soil moisture check", days: 75, alertBefore: 3, advice: "Control weeds and ensure no water stagnation in heavy rains." },
    { title: "Leaf spot / rhizome rot monitoring", days: 120, alertBefore: 4, advice: "Remove affected leaves, improve aeration, and follow recommended sprays if needed." },
    { title: "Harvest", days: 270, alertBefore: 10, advice: "Harvest when leaves dry and lodge; cure and boil rhizomes as per local practice." }
  ],

  Vegetables_Mixed: [
    { title: "Bed preparation & sowing", days: 0, alertBefore: 2, advice: "Prepare raised beds and sow recommended vegetable mix suited to season." },
    { title: "Thinning & gap filling", days: 15, alertBefore: 2, advice: "Maintain proper spacing by thinning dense patches and filling gaps." },
    { title: "1st Fertilizer / top dressing", days: 20, alertBefore: 2, advice: "Apply N-rich fertilizer for leafy vegetables; avoid overuse near harvest." },
    { title: "Pest scouting (borers, sucking pests)", days: 25, alertBefore: 2, advice: "Inspect underside of leaves for aphids, thrips, and caterpillars; use traps and biocontrols first." },
    { title: "Harvest window start", days: 40, alertBefore: 3, advice: "Begin staggered harvest to get tender, market-preferred produce." }
  ],

  Cashew: [
    { title: "Pruning & sanitation", days: 0, alertBefore: 7, advice: "Prune dead and diseased branches after harvest; burn pruned material outside orchard." },
    { title: "Fertilizer & manuring", days: 30, alertBefore: 7, advice: "Apply recommended manure and fertilizers in basins before flowering flush." },
    { title: "Flowering & TMB monitoring", days: 60, alertBefore: 5, advice: "Monitor for tea mosquito bug and other pests at flowering; use need-based control." },
    { title: "Nut set & moisture management", days: 90, alertBefore: 5, advice: "Ensure soil moisture during nut development; avoid grazing in orchard." },
    { title: "Harvest & drying", days: 150, alertBefore: 7, advice: "Collect fallen nuts regularly and dry on clean floor to maintain quality." }
  ],

  Arecanut: [
    { title: "Basal manuring", days: 0, alertBefore: 7, advice: "Apply FYM and fertilizers in basins before monsoon; avoid root damage." },
    { title: "Weeding & mulching", days: 30, alertBefore: 5, advice: "Weed basins and mulch with organic matter to conserve moisture." },
    { title: "Yellow leaf disease monitoring", days: 90, alertBefore: 5, advice: "Check palms for yellowing and poor nut set; improve drainage and follow local recommendations." },
    { title: "Irrigation scheduling", days: 120, alertBefore: 5, advice: "Provide life-saving irrigation during dry spells, especially in sandy soils." },
    { title: "Harvest round", days: 180, alertBefore: 7, advice: "Harvest mature bunches at correct stage and dry nuts properly for storage." }
  ]
};
