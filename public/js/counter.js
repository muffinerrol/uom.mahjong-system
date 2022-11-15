const counters = document.querySelectorAll('.counter');
const speed = 150;

counters.forEach(counter => {

    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;

        const inc = target / speed;

        if (target >= 0 && count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 1);
        } else if (target <= 0 && count > target) {
            counter.innerText = Math.floor(count + inc);
            setTimeout(updateCount, 1);
        } else {
            count.innerText = target;
        }
    }

    updateCount();

});