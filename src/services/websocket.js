'use strict';

import { processUpdatedItem } from '../scripts/ui-handler.js';
import { fetchAndDisplayWornItems } from './requests.js';

// Use the globally available XanoClient object
const XanoClient = window.XanoClient;

export async function xanoListener({
  baseUrl,
  realtimeHash,
  channel,
  callback,
  verbose,
}) {
  if (verbose) {
    console.log('Starting listener on channel', {
      baseUrl,
      realtimeHash,
      channel,
    });
  }

  const xano = new XanoClient({
    instanceBaseUrl: baseUrl,
    realtimeConnectionHash: realtimeHash,
  });

  const channelObj = xano.channel(channel);

  channelObj.on(function (action) {
    if (callback) callback(action);
  });

  if (verbose) console.log('WebSocket listener initialized');
}

export async function initializeWebSocket(players_id) {
  const baseUrl = 'https://xfr8-bsnk-8cuv.f2.xano.io/';
  const realtimeHash = 'fYrjiQuh4lLhPR6uaHMLbftBZc4';
  const channel = 'realTime';
  const verbose = true;

  async function handleRealtimeAction(action) {
    console.log('Real-time action received:', action);

    if (
      action.payload &&
      action.payload.data &&
      action.payload.data.type === 'equipmentUpdate'
    ) {
      const updatedItem = action.payload.data.updatedItem;
      const itemsData = action.payload.data.items_data;
      console.log('Processing updated item:', updatedItem, itemsData);
      await processUpdatedItem(updatedItem, itemsData);
    } else {
      console.error('Invalid action payload:', action.payload);
    }
  }

  await xanoListener({
    baseUrl,
    realtimeHash,
    channel,
    callback: handleRealtimeAction,
    verbose,
  });

  fetchAndDisplayWornItems(players_id); // Fetch initial data
}
