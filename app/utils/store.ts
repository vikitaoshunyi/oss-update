import EStore from 'electron-store';
const store = new EStore();

function get() {
  return store.get("state");
}
function set() {

}
function del() {

}
function save(state: any) {
  state = JSON.parse(JSON.stringify(state));
  if (state.syncing){
    delete state.syncing;
  }
  delete state.percent;
  delete state.filePercent;
  store.set("state", state);
}
export { get, save };