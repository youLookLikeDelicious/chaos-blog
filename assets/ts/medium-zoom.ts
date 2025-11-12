import mediumZoom from "medium-zoom"

const images = Array.from(document.querySelectorAll(".post-content img")) as HTMLImageElement[];
images.forEach((img) => {
    mediumZoom(img, {
        margin: 0 /* The space outside the zoomed image */,
        scrollOffset: 40 /* The number of pixels to scroll to close the zoom */,
        container: undefined /* The viewport to render the zoom in */,
        template: undefined /* The template element to display on zoom */,
        /*background: "rgba(50, 50, 50, 1)",*/
    });
});
