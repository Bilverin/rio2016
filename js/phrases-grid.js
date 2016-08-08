// Generated by CoffeeScript 1.9.3
(function() {
  var PhrasesGrid, select_boolean, select_float, select_integer;

  select_integer = function(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
  };

  select_float = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  select_boolean = function() {
    if (select_integer(0, 1) === 0) {
      return false;
    } else {
      return true;
    }
  };

  PhrasesGrid = (function() {
    function PhrasesGrid() {
      var base, count, distribution, grid, i, j, k, len, len1, line, lines;
      distribution = this.calculate_base_distribution();
      base = this.calculate_grid_base();
      lines = [];
      grid = [];
      for (j = 0, len = distribution.length; j < len; j++) {
        count = distribution[j];
        lines.push(this.make_grid_line(count));
      }
      for (i = k = 0, len1 = lines.length; k < len1; i = ++k) {
        line = lines[i];
        grid.push([base[i], line]);
      }
      this.current_point = 0;
      this.current_line = 0;
      this.grid = grid;
    }

    PhrasesGrid.prototype.calculate_base_distribution = function() {
      var distribution, first_losses, last_losses, switch_transitions;
      first_losses = select_integer(1, 3);
      last_losses = select_integer(1, 3);
      switch_transitions = select_boolean();
      distribution = [4, 4, 4, 4, 4];
      distribution[0] -= first_losses;
      distribution[4] -= last_losses;
      if (switch_transitions === true) {
        distribution[1] += last_losses;
        distribution[3] += first_losses;
      } else {
        distribution[1] += first_losses;
        distribution[3] += last_losses;
      }
      return distribution;
    };

    PhrasesGrid.prototype.calculate_grid_base = function() {
      var base, i, j, k, len, offset, ref, w, weight, weight_list;
      weight_list = [];
      weight = 0;
      offset = 0;
      base = [];
      for (i = j = 0; j <= 5; i = ++j) {
        weight += weight_list[i] = select_float(3, 5);
      }
      ref = weight_list.slice(0, 5);
      for (k = 0, len = ref.length; k < len; k++) {
        w = ref[k];
        offset += 1000 * w / weight;
        base.push(offset);
      }
      return base;
    };

    PhrasesGrid.prototype.make_grid_line = function(count) {
      var i, j, line, offset, ref, size, variation_x, variation_y;
      size = 1000.0 / count;
      offset = 0;
      line = [];
      for (i = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        variation_x = select_float(-150, 150);
        variation_y = select_float(-50, 50);
        line.push([variation_x, variation_y, offset + size / 2]);
        offset += size;
      }
      return line;
    };

    PhrasesGrid.prototype.get_grid = function() {
      return this.grid;
    };

    PhrasesGrid.prototype.get_next_position = function() {
      var line, point;
      line = this.grid[this.current_line];
      point = line[1][this.current_point];
      this.current_point++;
      if (this.current_point >= line[1].length) {
        this.current_point = 0;
        this.current_line += 1;
        if (this.current_line > this.grid.length) {
          return null;
        }
      }
      return [line[0], point];
    };

    return PhrasesGrid;

  })();

  this.PhrasesGrid = PhrasesGrid;

}).call(this);
