'use strict';

import * as a1lib from '@alt1/base';
import { initializeWebSocket } from '../src/services/websocket.js';
import { initializeUIHandlers } from '../src/scripts/ui-handler.js';

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');

  console.log(a1lib);

  if (window.alt1) {
    console.log('Alt1 detected');
    alt1.identifyAppUrl('/appconfig.json');
  } else {
    console.log('Alt1 not detected');
    alert('Alt1 not detected');
  }

  // Function to check if we have the necessary permissions
  function hasPermissions() {
    try {
      // Attempt to call a permission-dependent method
      a1lib.capture(0, 0, 1, 1); // Minimal capture to check for permissions
      return true; // If no exception, permissions are granted
    } catch (e) {
      return false; // Permissions are not yet granted
    }
  }

  // Function to wait for permissions and then execute the capture
  function waitForPermissionsAndCapture() {
    const checkInterval = 1000; // Check every 1000 milliseconds (1 second)

    const intervalId = setInterval(() => {
      if (hasPermissions()) {
        clearInterval(intervalId); // Stop checking once permissions are granted

        // Now execute the capture code
        var imgref = a1lib.capture(100, 100, 400, 400);
        var imagebuffer = imgref.toData();
        imagebuffer.show();
      } else {
        console.log('Waiting for permissions...');
      }
    }, checkInterval);
  }

  // Start waiting for permissions and capture when ready
  waitForPermissionsAndCapture();

  initializeUIHandlers();
});

const storedPlayerId = localStorage.getItem('players_id');
if (storedPlayerId) {
  document.getElementById('login-form').style.display = 'none';
  initializeWebSocket(storedPlayerId);
}

document.getElementById('pair-button').addEventListener('click', () => {
  const playerIdInput = document.getElementById('player-id').value;
  if (playerIdInput) {
    localStorage.setItem('players_id', playerIdInput);
    document.getElementById('login-form').style.display = 'none';
    initializeWebSocket(playerIdInput);
  }
});
