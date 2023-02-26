let para = document.getElementById("received");
let input = document.getElementById("input");
window.deno.onMessage((message) => {
  para.textContent = message;
});
function submit() {
  window.deno.send(input.value);
}
