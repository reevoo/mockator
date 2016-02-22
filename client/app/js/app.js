import $ from 'jquery';
require('jquery-ui/draggable');
require('jquery-ui/droppable');

// import DomOutline from './dom-outline';

import style from '../styles/styles.scss';
import productRating from '../img/product_rating.png';
import productRatingSmall from '../img/product_rating_small.png';

// let domOutlineActive = false;
let droppableActive = false;

const insertAfter = (element, reevooComponent) => {
  return () => {
    event.stopPropagation();
    reevooComponent.insertAfter(element);
    closeInsertModal();
  };
};

const insertBefore = (element, reevooComponent) => {
  return (event) => {
    event.stopPropagation();
    reevooComponent.insertBefore(element);
    closeInsertModal();
  };
};

const closeInsertModal = (event) => {
  if (event) {
    event.stopPropagation();
  }

  $('.reevoo-mockator-insert_modal').remove();
  // myDomOutline.start();
};

const openInsertModal = (element, reevooComponent = createBadge()) => {
  // myDomOutline.stop();

  const $buttonBefore = $('<button type="button">Before</button>');
  $buttonBefore.on('click', insertBefore(element, reevooComponent));
  const $buttonAfter = $('<button type="button">After</button>');
  $buttonAfter.on('click', insertAfter(element, reevooComponent));
  const $buttonCancel = $('<button type="button">Cancel</button>');
  $buttonCancel.on('click', closeInsertModal);

  const $buttonBar = $('<div class="reevoo-mockator-insert_modal__buttons_bar"></div>');
  $buttonBar.append($buttonBefore);
  $buttonBar.append($buttonAfter);
  $buttonBar.append($buttonCancel);

  const $title = $('<h5>Select where you want to insert the element:</h5>');

  const $modal = $('<div class="reevoo-mockator-insert_modal"></div>');
  const $content = $('<div class="reevoo-mockator-insert_modal__content"></div>');
  $content.append($title);
  $content.append($buttonBar);

  $modal.append($content);

  $('body').append($modal);
};

const clickHandler = (element) => {
  if ($(element).hasClass('reevoo-mockator-component')) {
    $(element).remove();
  } else {
    openInsertModal(element);
  }
};

// const myDomOutline = DomOutline({
//   borderWidth: 5,
//   realtime: true,
//   onClick: clickHandler,
//   label: true,
// });

const createBadge = (isDraggable = false, isSmall = false) => {
  const $badgeImg = $('<img class="reevoo-mockator-component reevoo-mockator-badge">');
  $badgeImg.attr('src', isSmall ? productRatingSmall : productRating);

  if (isDraggable) {
    $badgeImg.draggable({
      helper: 'clone',
    });
  }

  return $badgeImg;
};

// const toggleDomOutline = (event) => {
//   event.stopPropagation();
//
//   if (domOutlineActive) {
//     domOutlineActive = false;
//     myDomOutline.stop();
//     $('.reevoo-mockator-toolbar__toggle_button').text('Start');
//   } else {
//     domOutlineActive = true;
//     myDomOutline.start();
//     $('.reevoo-mockator-toolbar__toggle_button').text('Stop');
//   }
// };

const hideComponentsToolbar = () => {
  $('.reevoo-mockator-toolbar_components').hide();
};

const init = () => {
  const $body = $('body');

  $body.addClass('reevoo-mockator');

  const $toolbarComponents = $('<div class="reevoo-mockator-toolbar_components"></div>');
  $toolbarComponents.append(createBadge(true));
  $toolbarComponents.append(createBadge(true, true));

  const $toolbar = $('<div class="reevoo-mockator-toolbar"></div>');

  const $icon0 = $('<div class="reevoo-icon"></div>');

  const $icons = $('<div class="reevoo-mockator-toolbar__centered_icons"></div>');
  const $icon1 = $('<div class="reevoo-icon icon1"></div>');
  const $icon2 = $('<div class="reevoo-icon icon2"></div>');

  const $icon3 = $('<div class="reevoo-icon icon3"></div>');
  $icon3.on('click', function () {
    $('.reevoo-mockator-toolbar_components').css('display', 'flex');

    if (!droppableActive) {
      droppableActive = true;
      $('*').droppable({
        greedy: true,
        drop: function (event, ui) {
          event.stopImmediatePropagation();

          let badge = null;

          if (ui.draggable[0].src == productRatingSmall) {
            badge = createBadge(false, true);
          } else {
            badge = createBadge();
          }

          openInsertModal(event.target, badge);
        },
      });
    }
  });

  const $icon4 = $('<div class="reevoo-icon icon4"></div>');
  const $icon5 = $('<div class="reevoo-icon icon5"></div>');

  const $icon6 = $('<div class="reevoo-icon icon6"></div>');

  $icon1.on('click', hideComponentsToolbar);
  $icon2.on('click', hideComponentsToolbar);
  $icon4.on('click', hideComponentsToolbar);
  $icon5.on('click', hideComponentsToolbar);
  $icon6.on('click', hideComponentsToolbar);

  $icons.append($icon1);
  $icons.append($icon2);
  $icons.append($icon3);
  $icons.append($icon4);
  $icons.append($icon5);

  $toolbar.append($icon0);
  $toolbar.append($icons);
  $toolbar.append($icon6);

  // const $toggleDomOutlineButton =
  //   $('<button class="reevoo-mockator-toolbar__toggle_button">Start</button>');
  // $toggleDomOutlineButton.on('click', toggleDomOutline);

  // $toolbar.append($toggleDomOutlineButton);

  $body.append($toolbarComponents);
  $body.append($toolbar);
};

// Initial execution
$(document).ready(init);
