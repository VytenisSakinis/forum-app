const header = document.querySelector(".header");

window.addEventListener("scroll", function () {
	console.log("a");
	if (window.scrollY > 100) {
		header.style.backgroundColor = "#423f3eca";
	} else {
		header.style.backgroundColor = "#423f3eca";
	}
});
function destroyEvent(event) {
	event.target.remove();
}
