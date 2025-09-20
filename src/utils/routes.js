import {stringSimilarity} from './similarity'

const handleSave = (routeIds, from, to, time) => {
  let saved = JSON.parse(localStorage.getItem("saved_routes") || "[]");

  // Check for duplicates (from + to must be similar)
  const exists = saved.some(
    (r) =>
      stringSimilarity(r.from, from) > 0.8 &&
      stringSimilarity(r.to, to) > 0.8
  );

  if (!exists) {
    saved.push({ routeIds, from, to, time, savedAt: new Date().toISOString() });
    localStorage.setItem("saved_routes", JSON.stringify(saved));
  }
  else {
    saved.push({ routeIds, from, to, time, savedAt: new Date().toISOString() });
    localStorage.setItem("saved_routes", JSON.stringify(saved));
  }
};

const handleUnsave = (from, to) => {
  let saved = JSON.parse(localStorage.getItem("saved_routes") || "[]");

  const updated = saved.filter(
    (r) =>
      stringSimilarity(r.from, from) < 0.8 ||
      stringSimilarity(r.to, to) < 0.8
  );

  localStorage.setItem("saved_routes", JSON.stringify(updated));
};

const handleGetSavedRoutes = () => {
  return JSON.parse(localStorage.getItem("saved_routes") || "[]");
};

export { handleSave, handleUnsave, handleGetSavedRoutes };
