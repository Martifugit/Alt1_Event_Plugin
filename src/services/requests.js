'use strict';

import { processInitialItem } from '../scripts/ui-handler.js';

export async function fetchWornItems(players_id) {
  try {
    const response = await fetch(
      `https://xfr8-bsnk-8cuv.f2.xano.io/api:Gf29Obz4/alt1_equipment_ws?players_id=${players_id}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch worn items:', error);
  }
}

export function fetchAndDisplayWornItems(players_id) {
  fetchWornItems(players_id)
    .then((data) => {
      if (data && Array.isArray(data)) {
        data.forEach((item) => {
          if (item.items) {
            processInitialItem(item);
          } else {
            console.error('items is missing for item:', item);
          }
        });
      } else {
        console.log('No worn items found or response is not an array');
      }
    })
    .catch((error) => {
      console.error('Error in fetchAndDisplayWornItems:', error);
    });
}
