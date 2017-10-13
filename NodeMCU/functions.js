function set_pin(cmd) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() { 
    if (xhttp.readyState == 4 && xhttp.status == 200) { 
    }
  };
  xhttp.open('GET','?api='+cmd, true);
  xhttp.send();
}

function set_img(onOff, pin, folder) {
  btn = document.getElementById('btn'+pin);
  btn.src = folder+onOff+pin+'.png';
}

function toggle_pin(pin, folder) {
  btn = document.getElementById('btn'+pin);
  if (btn.src.substr(53,2) == 'on') {
    set_img('off', pin, folder);
    if (both != "BOTH") { // "BOTH" means the actual pins are being cycled directly on the server
      set_pin('SETOFF'+pin);
    }
  } else {
    set_img('on', pin, folder);
    if (both != "BOTH") { 
      set_pin('SETON'+pin);
    }
  }
}

function offall(folder) {
  for (i = 1; i <= 8; i++) {
    set_img('off', i, folder);
    set_pin('SETOFF'+i);
  }
}

function onall(folder) {
  for (i = 1; i <= 8; i++) {
    set_img('on', i, folder);
    set_pin('SETON'+i);
  }
}

var tmrID;
var both = "NO";
function cycle(folder, both_in) { 
  both = both_in;
  offall(folder);
  var dir = document.getElementById('direction').value;
  var num_pins = document.getElementById('num_pins').value;
  var speed = document.getElementById('speed').value;
  if (both == "BOTH") {
    // get the server to do its own cycling
    set_pin('CYCLE&dir='+dir+'&numpins='+num_pins+'&speed='+speed);
  }
  if (num_pins == 1) {
    cycle_by_one(folder);
  } else if (num_pins == 2) {
    cycle_by_two(folder);
  } else {
    var i = 1; 
    var pin = (dir == 'cw' ? 1 : 8);
    var min_pin = pin;
    var max_pin = (dir == 'cw' ? 8 : 1);
    tmrID = setInterval(chgPin, speed);
    function chgPin() { 
      if (i > 10) { 
        clearInterval(tmrID);
      } else { 
        toggle_pin(pin, folder);
        pin = pin + (dir == 'cw' ? 1 : -1);
        if ((pin < 1) || (pin > 8)) { 
          pin = min_pin;
          i++;
        }
      }
    }
  }
}

function cycle_by_one(folder){
  var dir = document.getElementById('direction').value;
  var i = 1; 
  var pin = (dir == 'cw' ? 1 : 8);
  var prev_pin;
  var min_pin = pin;
  var max_pin = (dir == 'cw' ? 8 : 1);
  var speed = document.getElementById('speed').value;
  toggle_pin(pin, folder);
  tmrID = setInterval(chgPin, speed);
  function chgPin() { 
    if (i > 10) { 
      clearInterval(tmrID);
      toggle_pin(pin, folder);
    } else { 
      prev_pin = pin;
      pin = pin + (dir == 'cw' ? 1 : -1);
      if ((pin < 1) || (pin > 8)) { 
        pin = min_pin;
        i++;
      }
      toggle_pin(prev_pin, folder);
      toggle_pin(pin, folder);
    }
  }
}

function cycle_by_two(folder){
  var dir = document.getElementById('direction').value;
  var i = 1; 
  var pin1 = 1;
  var prev1;
  var pin2 = 8;
  var prev2;
  var speed = document.getElementById('speed').value;
  toggle_pin(pin1, folder);
  toggle_pin(pin2, folder);
  tmrID = setInterval(chgPin, speed);
  function chgPin() { 
    if (i > 10) { 
      clearInterval(tmrID);
      offall(folder);
    } else { 
      prev1 = pin1;
      prev2 = pin2;
      pin1++;
      pin2--;
      if (pin1 > 8) {
        pin1 = 1;
        pin2 = 8;
        i++;
      }
      toggle_pin(pin1, folder);
      toggle_pin(pin2, folder);
      toggle_pin(prev1, folder);
      toggle_pin(prev2, folder);
    }
  }
}

function cycle_stop(both) {
  clearInterval(tmrID);
  set_pin('CYCLE&speed=0');
  offall();
}
