'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

/// Tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///
const nav = document.querySelector('nav');

// This function opens the modal by removing the 'hidden' class from the `modal` and `overlay` elements
const openModal = function (e) {
  e.preventDefault(); 
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// function to close the modal window and hide the overlay
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// loop through each element with class 'btnsOpenModal'
btnsOpenModal.forEach(btn => { 
    btn.addEventListener('click' , openModal); 
});


// Add event listener to btnCloseModal to call closeModal on click
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Add an event listener to the document object.
// When a keydown event is detected: 
document.addEventListener('keydown', function (e) {
  // Check if the Escape key was pressed and the modal element doesn't have the class "hidden". 
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click' , function (e) { 
  // scroll section1 into view with smooth behavior 
  section1.scrollIntoView({behavior:'smooth'})
});

/// nav-links smooth scroll
document.querySelector('.nav__links').addEventListener('click',function (e){
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});


// Tabbed Component



tabsContainer.addEventListener('click' , function (e) {
  const clicked = e.target.closest('.operations__tab');

  if(!clicked) return;

  // Remove active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate Tab
  clicked.classList.add('operations__tab--active');

  // Activate Content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
});

// Menu Fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this; 
  }
};

// passing "argument" into handler
nav.addEventListener('mouseover' , handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));



// Navbar Sticky on Scroll


const header = document.querySelector('.header');

// Get the height of the navigation bar and store it in a variable called navHeight
const navHeight = nav.getBoundingClientRect().height;

// Define a function called stickyNav that takes an array called entries as its parameter
const stickyNav = function (entries) {

  // Get the first element in the entries array and store it in a variable called entry
  const [entry] = entries;

  // If entry is not intersecting (i.e., if header is not visible on screen), add the class 'sticky' to the navigation bar
  if (!entry.isIntersecting) nav.classList.add('sticky');
  
  // Otherwise, remove the class 'sticky' from the navigation bar
  else nav.classList.remove('sticky');
};

// Create a new IntersectionObserver called headerObserver that will run the stickyNav function when the header section intersects with the root element
const headerObserver = new IntersectionObserver(stickyNav , {
  root : null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

// Observe the 'header' element using headerObserver
headerObserver.observe(header);


// Reveal sections
const allSections = document.querySelectorAll('.section');

// Define a function to handle intersecting entries
const revealSection = function (entries , observer) {
  const [entry]  = entries;
  
  // Return if the entry is not intersecting with the viewport
  if(!entry.isIntersecting) return;

  // Remove the class 'section--hidden' from the target element
  entry.target.classList.remove('section--hidden');

  // Stop observing the target element
  observer.unobserve(entry.target);
}

// Create an IntersectionObserver object with the revealSection function as callback
const sectionObserver = new IntersectionObserver(revealSection,{
  root:null, // Use the viewport as the root
  threshold:0.15, // Call the callback when 15% of the element is visible
});

// Loop through all the sections and make them hidden by adding a class 'section--hidden'
allSections.forEach(function (section){
  // Start observing each section element
  sectionObserver.observe(section);

  // Add the class 'section--hidden' to hide the sections
  section.classList.add('section--hidden');
});


// Lazy Loading Images


const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries , observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with Data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load' , function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg , {
  root: null ,
  threshold : 0 ,
  rootMargin:'200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


/// Slider

// This function creates a slider functionality with several slides, 
// featuring two buttons to go to the previous or next slide and dots to move to specific slide.
 const slider = function () {
  // Selecting elements
  const slides = document.querySelectorAll('.slide');  
  const btnLeft = document.querySelector('.slider__btn--left');   
  const btnRight = document.querySelector('.slider__btn--right');  
  const dotContainer = document.querySelector('.dots');   

  let curSlide = 0;  // initialization of current slide number as zero 
  const maxSlide = slides.length;  // maximum number of slides. 

  // Functions

  // A helper function that creates the dots for each slide
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',                                           
        `<button class="dots__dot" data-slide="${i}"></button>`  
        
      );
    });
  };

  // A function which activates (changes the color of) currently active dot according to the slide number 
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')  
      .forEach(dot => dot.classList.remove('dots__dot--active')); 
     
    // activate only the one that corresponds to the current slide number
    document 
      .querySelector(`.dots__dot[data-slide="${slide}"]`)   
      .classList.add('dots__dot--active');
  };

  // A function which moves the slider by translating slides horizontally based on the provided slide number.
  const goToSlide = function (slide) {
    slides.forEach( 
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) 
       // Change the offset/position of each slide based on their index position and the desired slide number
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {  // If the current slide number is the last slide, reset to first slide
      curSlide = 0;
    } else {
      curSlide++;    // Otherwise, move to the next slide number  
    }
    goToSlide(curSlide);   
    activateDot(curSlide); 
  };

  // A function to move the slider to the previous slide.
  const prevSlide = function () {
    if (curSlide === 0) {       // If the current slide number is the first, change it to the last slide by seting it equal to the maximum slide number minus 1
      curSlide = maxSlide - 1;
    } else {
      curSlide--;   // Otherwise, move to the previous slide number
    }
    goToSlide(curSlide); 
    activateDot(curSlide); 
  };

  // Initialization method which render the first image and activate the first dot
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Change to the next or previous slide using keyboard left or right arrows
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // shortcut syntax for executing nextSlides() function if e.key == 'ArrowRight'
  });

  
  // Handling the click of each individual Dot to move directly to the corresponding slide without requiring to loop through all the slides
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {       // only activate if the target object has the class of dots
      const { slide } = e.target.dataset;
      goToSlide(slide);     // move directly to the corresponding slide
      activateDot(slide);   // activate the corresponding dot
    }
  });
};

// Calling the slider function to start working
slider(); 
