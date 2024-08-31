export default function pluck_object(inputObj={},keys=[]) {
  const filteredKeys = Object.keys(inputObj).filter(key =>
    keys.includes(key),
  );

  // Create a new object with key-value pairs based on the filtered keys
  return Object.fromEntries(filteredKeys.map(key => [key, inputObj[key]]));
}
