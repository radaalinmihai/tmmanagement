import {
  clockRunning,
  startClock,
  stopClock,
  SpringUtils,
  spring,
  cond,
  set,
  Value,
} from 'react-native-reanimated';
function runSpring(clock, value, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
    bounciness: 0,
    speed: 12,
    ...SpringUtils.makeDefaultConfig(),
  });

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export default runSpring;
