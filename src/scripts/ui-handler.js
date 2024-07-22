'use strict';

// import { fetchAndDisplayWornItems } from '.src/services/requests.js';

// Handle Plugin Tabs
function initializeUIHandlers() {
  const tabs = document.querySelectorAll('.contenttab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      contents.forEach((content) => content.classList.remove('active'));

      const target = tab.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
    });

    tab.addEventListener('mouseenter', function () {
      let tooltip = tab.querySelector('.tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tab.getAttribute('data-tooltip');
        tab.appendChild(tooltip);
      }
      tooltip.style.display = 'block';
    });

    tab.addEventListener('mouseleave', function () {
      const tooltip = tab.querySelector('.tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    });
  });
}

export { initializeUIHandlers };

// Process initial Plugin Equipment Slot data from Xano
export function processInitialItem(item) {
  const slot = item.slot;
  const equipped = item.equipped;
  const itemName = item.items.name || 'Unknown Item';
  const imageUrl = item.items.image.url
    ? item.items.image.url.replace('backend', 'xfr8-bsnk-8cuv.f2.xano.io')
    : fallbackUrls[slot];

  updateEquipmentIcon(slot, imageUrl, itemName, equipped);
  console.log(
    `Initial load: ${itemName} is ${equipped ? 'equipped' : 'unequipped'}`
  );
}

// Default Urls
const fallbackUrls = {
  mainhand: 'assets/icons/weapon.webp',
  offhand: 'assets/icons/shield.webp',
  head: 'assets/icons/head.webp',
  cape: 'assets/icons/cape.webp',
  body: 'assets/icons/torso.webp',
  legs: 'assets/icons/legs.webp',
  gloves: 'assets/icons/gloves.webp',
  boots: 'assets/icons/boots.webp',
  neck: 'assets/icons/neck.webp',
  ring: 'assets/icons/ring.webp',
  pocket: 'assets/icons/pocket.webp',
  aura: 'assets/icons/aura.webp',
  ammo: 'assets/icons/ammo.webp',
};

// Process updated item data
// Process updated item data
export async function processUpdatedItem(updatedItem, itemsData) {
  if (!updatedItem || !updatedItem.slot || !itemsData) {
    console.error('Invalid updated item data:', updatedItem, itemsData);
    return;
  }

  // Adjust slot for 2h
  const slot = updatedItem.slot === '2h' ? 'mainhand' : updatedItem.slot;
  const equipped = updatedItem.equipped;
  const itemName = itemsData.name || 'Unknown Item';

  console.log('Updated item url:', itemsData.image.url);

  const imageUrl =
    equipped && itemsData.image.url !== undefined
      ? itemsData.image.url.replace('backend', 'xfr8-bsnk-8cuv.f2.xano.io')
      : fallbackUrls[slot];

  console.log('The fallback URL is:', fallbackUrls[slot]);

  updateEquipmentIcon(slot, imageUrl, itemName, equipped);
  console.log(
    `Updated load: ${itemName} is ${equipped ? 'equipped' : 'unequipped'}`
  );
}

// Update Plugin Equipment Icons
export function updateEquipmentIcon(slot, imageUrl, itemName, equipped) {
  let slotElement;
  if (slot === 'mainhand' || slot === '2h') {
    slotElement = document.querySelector('.equipment-icon[data-slot="weapon"]');
    if (slot === '2h') {
      const shieldSlot = document.querySelector(
        '.equipment-icon[data-slot="shield"]'
      );
      if (shieldSlot) {
        shieldSlot.src = fallbackUrls['offhand'];
        shieldSlot.title = '';
        shieldSlot.style.opacity = '0.5';
      }
    }
  } else if (slot === 'offhand') {
    slotElement = document.querySelector('.equipment-icon[data-slot="shield"]');
  } else {
    slotElement = document.querySelector(
      `.equipment-icon[data-slot="${slot}"]`
    );
  }

  if (slotElement) {
    // Check if the current state is different from the new state
    const currentSrc = slotElement.src;
    const currentTitle = slotElement.title;
    const currentOpacity = slotElement.style.opacity;

    if (
      currentSrc === imageUrl &&
      currentTitle === (equipped ? itemName : '') &&
      currentOpacity === (equipped ? '1' : '0.5')
    ) {
      // No changes needed
      return;
    }

    // Update the equipment icon
    slotElement.src = imageUrl;
    slotElement.title = equipped ? itemName : '';
    slotElement.style.opacity = equipped ? '1' : '0.5';
  }
}
