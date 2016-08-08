// Generated by CoffeeScript 1.9.3
(function() {
  var PhrasesController, PhrasesLayer;

  PhrasesController = {
    current_layer: 0,
    phrases_done: 0,
    layers: [],
    state: 0,
    story_length: 0,
    load_phrases: function() {
      return $.get("phrases.json", (function(_this) {
        return function(data) {
          return _this.init_layers(data);
        };
      })(this), "json");
    },
    init_layers: function(data) {
      var i, k, l, len, phrase;
      this.layers.push(new PhrasesLayer());
      for (k = 0, len = data.length; k < len; k++) {
        phrase = data[k];
        if (this.phrases_done === 20) {
          this.goto_next_layer();
          this.phrases_done = 0;
        }
        this.layers[this.current_layer].append_phrase(phrase.title, phrase.text);
        this.phrases_done += 1;
      }
      for (i = l = 1; l <= 5; i = ++l) {
        this.layers[this.current_layer].separate_boxes();
      }
      this.distribute_layers();
      return this.init_space_navigation();
    },
    goto_next_layer: function() {
      var i, k;
      for (i = k = 1; k <= 5; i = ++k) {
        this.layers[this.current_layer].separate_boxes();
      }
      this.layers.push(new PhrasesLayer());
      return this.current_layer++;
    },
    distribute_layers: function() {
      var count, i, k, layer, len, ref, results, start;
      count = this.layers.length;
      start = 25 * (count - 1) + 100;
      ref = this.layers;
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        layer = ref[i];
        results.push(layer.set_distance(start - i * 25));
      }
      return results;
    },
    init_space_navigation: function() {
      $(".scroll-block").css("height", 400 * this.layers.length + 600 + "px");
      this.story_length = 400 * this.layers.length;
      return $(window).scroll((function(_this) {
        return function() {
          var k, layer, len, offset, opacity, ref, results;
          offset = $(window).scrollTop();
          if (offset < 350) {
            if (_this.state > 0) {
              $(".phrases-window").css("position", "relative");
              $(".phrases-window").css("top", "0");
              $(".phrases-window").css("bottom", "auto");
              $(".phrases-window").css("height", "800px");
              _this.state = 0;
            }
            return;
          }
          if (offset > _this.story_length && _this.state < 2) {
            $(".phrases-window").css("bottom", "auto");
            $(".phrases-window").css("height", "800px");
            _this.state = 2;
          }
          if (offset < _this.story_length && _this.state === 2) {
            $(".phrases-window").css("top", "100px");
            $(".phrases-window").css("bottom", "50px");
            $(".phrases-window").css("height", "auto");
            _this.state = 1;
          }
          if (_this.state === 2) {
            opacity = 1.0 - (offset - _this.story_length) / 800;
            if (opacity < 0.5) {
              opacity = 0.5;
            }
            $(".phrases-window").css("top", _this.story_length + 100 - offset + "px");
            $(".phrases-window").css("opacity", opacity);
          }
          if (offset > _this.story_length + 300) {
            return;
          }
          if (_this.state === 0) {
            $(".phrases-window").css("position", "fixed");
            $(".phrases-window").css("top", "100px");
            $(".phrases-window").css("bottom", "50px");
            $(".phrases-window").css("height", "auto");
            _this.state = 1;
          }
          ref = _this.layers;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            layer = ref[k];
            results.push(layer.move_distance(-25.0 * (offset - 350) / 400.0));
          }
          return results;
        };
      })(this));
    },
    open_phrase_text: function(title, text) {
      $("#modal-title").html(title);
      $("#modal-text").html(text);
      return $("#modal-trigger").click();
    }
  };

  PhrasesLayer = (function() {
    var base_size;

    base_size = 50;

    function PhrasesLayer() {
      this.container = $('<div class="phrases-layer">');
      $(".phrases-window").append(this.container);
      this.grid = new PhrasesGrid();
      this.phrases = [];
    }

    PhrasesLayer.prototype.append_phrase = function(phrase, text) {
      var font_size, phrase_box;
      phrase_box = this.construct_phrase_box(phrase);
      font_size = this.calculate_font_size(phrase);
      phrase_box.css("font-size", font_size + "px");
      this.container.append(phrase_box);
      phrase_box.css("width", phrase_box.width() + "px");
      phrase_box.css("height", phrase_box.height() + "px");
      this.place_phrase_box(phrase_box);
      this.phrases.push(phrase_box);
      return phrase_box.click(function() {
        return PhrasesController.open_phrase_text(phrase, text);
      });
    };

    PhrasesLayer.prototype.construct_phrase_box = function(phrase) {
      return $('<div class="phrase">').html(phrase);
    };

    PhrasesLayer.prototype.calculate_font_size = function(phrase) {
      var phrase_length, scale_ratio;
      phrase_length = phrase.length;
      scale_ratio = 1.0;
      if (phrase_length > 7) {
        scale_ratio = 7.0 / phrase_length;
      }
      return base_size * scale_ratio;
    };

    PhrasesLayer.prototype.place_phrase_box = function(box) {
      var height, position, width;
      position = this.grid.get_next_position();
      width = box.width();
      height = box.height();
      box.css("left", position[0] / 10.0 + "%");
      box.css("top", position[1][2] / 10.0 + "%");
      box.css("margin-left", position[1][0] - width / 2 + "px");
      return box.css("margin-top", position[1][1] - height / 2 + "px");
    };

    PhrasesLayer.prototype.separate_boxes = function() {
      var collision, i, j, k, max, phrases_bound_boxes, ref, results;
      phrases_bound_boxes = this.find_bound_boxes();
      max = phrases_bound_boxes.length;
      results = [];
      for (i = k = 0, ref = max; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        results.push((function() {
          var l, ref1, ref2, results1;
          results1 = [];
          for (j = l = ref1 = i + 1, ref2 = max; ref1 <= ref2 ? l < ref2 : l > ref2; j = ref1 <= ref2 ? ++l : --l) {
            collision = this.test_collision(phrases_bound_boxes, i, j, 0);
            if (collision !== null) {
              results1.push(this.move_boxes(collision));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    PhrasesLayer.prototype.test_collision = function(boxes, box_i, box_j, iteration) {
      var box_1, box_2, exit_vectors, vector_x, vector_y;
      box_1 = boxes[box_i];
      box_2 = boxes[box_j];
      exit_vectors = [];
      if (this.is_point_in(box_2[0], box_2[2], box_1)) {
        exit_vectors.push([box_1[1] - box_2[0], box_1[3] - box_2[2]]);
      }
      if (this.is_point_in(box_2[1], box_2[2], box_1)) {
        exit_vectors.push([box_1[0] - box_2[1], box_1[3] - box_2[2]]);
      }
      if (this.is_point_in(box_2[1], box_2[3], box_1)) {
        exit_vectors.push([box_1[0] - box_2[1], box_1[2] - box_2[3]]);
      }
      if (this.is_point_in(box_2[0], box_2[3], box_1)) {
        exit_vectors.push([box_1[1] - box_2[0], box_1[2] - box_2[3]]);
      }
      if (exit_vectors.length < 1) {
        if (iteration === 0) {
          return this.test_collision(boxes, box_j, box_i, 1);
        } else {
          return null;
        }
      }
      if (exit_vectors.length > 2) {
        console.log("Ошибка, прямоугольник утонул!");
      }
      if (exit_vectors.length === 1) {
        return [box_i, box_j, exit_vectors[0]];
      }
      if (exit_vectors.length === 2) {
        vector_x = (exit_vectors[0][0] + exit_vectors[1][0]) / 2;
        vector_y = (exit_vectors[0][1] + exit_vectors[1][1]) / 2;
        return [box_i, box_j, [vector_x, vector_y]];
      }
    };

    PhrasesLayer.prototype.is_point_in = function(x, y, box) {
      if (x > box[0] && x < box[1]) {
        if (y > box[2] && y < box[3]) {
          return true;
        }
      }
    };

    PhrasesLayer.prototype.move_boxes = function(collision) {
      var box_1, box_2, offset_1, offset_2, vector;
      box_1 = this.phrases[collision[0]];
      box_2 = this.phrases[collision[1]];
      vector = collision[2];
      if (Math.abs(vector[0]) > Math.abs(vector[1])) {
        offset_1 = -vector[0] / 2;
        offset_2 = vector[0] / 2;
        box_1.css("margin-left", "+=" + offset_1);
        return box_2.css("margin-left", "+=" + offset_2);
      } else {
        offset_1 = -vector[1] / 2;
        offset_2 = vector[1] / 2;
        box_1.css("margin-top", "+=" + offset_1);
        return box_2.css("margin-top", "+=" + offset_2);
      }
    };

    PhrasesLayer.prototype.find_bound_boxes = function() {
      var bound_box, bound_boxes, k, len, phrase, pos, ref, window_height, window_width;
      window_width = this.container.width();
      window_height = this.container.height();
      bound_boxes = [];
      ref = this.phrases;
      for (k = 0, len = ref.length; k < len; k++) {
        phrase = ref[k];
        pos = phrase.position();
        pos.left += parseInt(phrase.css("margin-left"));
        pos.top += parseInt(phrase.css("margin-top"));
        bound_box = [pos.left - 15, pos.left + phrase.width() + 15, pos.top - 15, pos.top + phrase.height() + 15];
        bound_boxes.push(bound_box);
      }
      return bound_boxes;
    };

    PhrasesLayer.prototype.set_distance = function(distance) {
      var opacity_value, scale_ratio;
      this.distance = this.distance || distance;
      if (distance < 0.0) {
        distance = 0.0;
      }
      scale_ratio = 100.0 / distance;
      if (scale_ratio > 3.0) {
        scale_ratio = 3.0;
      }
      if (distance < 100.0) {
        opacity_value = 1.0 - (scale_ratio - 1.0) / 2.0;
      } else {
        opacity_value = 100.0 / (distance * 3.0 - 200.0);
        if (opacity_value < 0.0) {
          opacity_value = 0.0;
        }
      }
      if (distance > 87.5 && distance < 112.5 && this.state !== true) {
        this.container.addClass("underlined");
        this.container.css("z-index", "2");
        this.state = true;
      }
      if ((distance < 87.5 || distance > 112.5) && this.state !== false) {
        this.container.removeClass("underlined");
        this.container.css("z-index", "0");
        this.state = false;
      }
      this.container.css("transform", "scale(" + scale_ratio + ")");
      return this.container.css("opacity", "" + opacity_value);
    };

    PhrasesLayer.prototype.move_distance = function(delta) {
      return this.set_distance(this.distance + delta);
    };

    return PhrasesLayer;

  })();

  PhrasesController.load_phrases();

}).call(this);
