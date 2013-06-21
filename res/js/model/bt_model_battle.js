"use strict";

/* =====================================================================================================================
 *  Binary tactics: 'Battle view's data model' definitions
 * ================================================================================================================== */


// Battle view's data model definition
// ---------------------------------------------------------------------------------------------------------------------
bt.model.definitions.battle = {

    // Most basic entity
    stone : function(obj) {
        // Extend passed object
        if (obj) bt.model.extend(this, obj);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) for (var element in bt.model.common.elements.definitions) {
            if (!angular.isDefined(this[bt.model.common.elements.definitions[element]])) console.error(obj, 'Stone object definition incomplete: Missing "' + bt.model.common.elements.definitions[element] + '" element!');
        }
    },

    // Stone as composition
    cStone : function(obj) {
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(obj.comp)) console.error(obj, 'cStone object definition incomplete: Missing composition!!');
        }
        // Initialize children
        this.comp = new bt.model.definitions.battle.stone(obj.comp);
    },

    // Differentiated stone definition
    dStone : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, new bt.model.definitions.battle.cStone(obj));
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(obj.element)) console.error(obj, 'dStone object definition incomplete: Missing element differentiation!');
        }
        // Initialize children
        this.element = obj.element;
    },

    // Localized definition
    localized : function(obj) {
        // Extend location from passed object
        if ((angular.isDefined(obj.location)) && (obj.location.length == 2)) {
            this.location = {
                x : obj.location[0],
                y : obj.location[1]
            }
        } else if ((angular.isDefined(obj.location)) && (angular.isDefined(obj.location.x)) && (angular.isDefined(obj.location.y))) {
            this.location = {
                x : obj.location.x,
                y : obj.location.y
            }
        }
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if ((!angular.isDefined(this.location)) || (!angular.isDefined(this.location.x)) || (!angular.isDefined(this.location.y))) console.error(obj, 'Localized object definition incomplete: Missing location!');
        }

        // Update functionality
        this.updateLocation = function(location) {
            if ((angular.isArray(location)) && (location.length == 2)) {
                this.location.x = location[0];
                this.location.y = location[1];
            } else if (angular.isObject(location)) {
                this.location.x = location.x;
                this.location.y = location.y;
            }
        }
    },

    // Weapon definition
    weapon : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, obj);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            var hasWeapon = false;
            for (var weapon in bt.model.common.weapons.definitions) if (angular.isDefined(this[bt.model.common.weapons.definitions[weapon]])) hasWeapon = true;
            if (!hasWeapon) console.error(obj, 'Weapon object definition incomplete: Missing weapon!');
        }
        // Initialize children
        for (var weapon in bt.model.common.weapons.definitions) {
            if (angular.isDefined(this[bt.model.common.weapons.definitions[weapon]])) {
                this._type = bt.model.common.weapons.definitions[weapon];
                this[bt.model.common.weapons.definitions[weapon]] = new bt.model.definitions.battle.dStone(this[bt.model.common.weapons.definitions[weapon]]);
            }
        }

        // Gets weapon dStone definition
        this.getDStone = function() {return this[this._type]; }
        this._dStone = this[this._type];
    },

    // Basic unit definition
    unit : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [obj, new bt.model.definitions.battle.dStone(obj), new bt.model.definitions.battle.localized(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(this.name)) console.error(obj, 'Unit object definition incomplete: Missing name!');
        }
        // Initialize children
        this.updateStats = function() {
            this.value = this.comp[bt.model.common.elements.definitions.E] + this.comp[bt.model.common.elements.definitions.F] +this.comp[bt.model.common.elements.definitions.I] + this.comp[bt.model.common.elements.definitions.W];
            this.general = {
                value : this.value,
                attack : (4 * this.value),
                defense : (2 * this.value)
            };
            this.physical = { };
            this.physical.value = (2 * this.value);
            this.physical.attack = (this.physical.value + this.general.attack + (2 * this.comp[bt.model.common.elements.definitions.F]));
            this.physical.defense = (this.physical.value + this.general.defense + (2 * this.comp[bt.model.common.elements.definitions.E]));
            this.magic = { };
            this.magic.value = (2 * this.value);
            this.magic.attack = (this.magic.value + this.general.attack + (2 * this.comp[bt.model.common.elements.definitions.I]));
            this.magic.defense = (this.magic.value + this.general.defense + (2 * this.comp[bt.model.common.elements.definitions.W]));
            this.hp = (4 * (this.physical.defense + this.magic.defense + this.value));
        }
        this.updateStats();

        // Update functionality
        this.updateHp = function(hp) {
            this.hp = hp;
        }
    },

    // Grid definition
    unitsCollection : function() {
        // Initialize children
        this.units = [ ];
        this.unitsById = [ ];
        this.unitsByType = [ ];
        this.unitsByOwner = [ ];

        // Adds a tile to the grid
        this.addUnit = function(unit) {
            this.units.push(unit);
            if (unit.id) {
                this.unitsById[unit.id] = unit;
            }
            if (unit.owner) {
                if (!angular.isDefined(this.unitsByOwner[unit.owner])) this.unitsByOwner[unit.owner] = [ ];
                this.unitsByOwner[unit.owner].push(unit);
            }
            if (unit._type) {
                if (!angular.isDefined(this.unitsByType[unit._type])) this.unitsByType[unit._type] = [ ];
                this.unitsByType[unit._type].push(unit);
            }
        }
    },

    // Scient unit definition
    scient : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [obj, new bt.model.definitions.battle.unit(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(this.id)) console.error(obj, 'Scient object definition incomplete: Missing id!');
            if (!angular.isDefined(this.owner)) console.error(obj, 'Scient object definition incomplete: Missing owner!');
            if (!angular.isDefined(this.sex)) console.error(obj, 'Scient object definition incomplete: Missing sex!');
            if (!angular.isDefined(this.weapon)) console.error(obj, 'Scient object definition incomplete: Missing weapon!');
            if ((!angular.isDefined(this.weapon_bonus)) || (!angular.isDefined(this.weapon_bonus.stone))) console.error(obj, 'Scient object definition incomplete: Missing weapon bonus!');
        }
        // Initialize children
        this._type = bt.model.common.units.definitions.scient;
        this.style = (this.owner == bt.game.authentication.username ? bt.config.game.battle.styles.player : bt.config.game.battle.styles.enemy);
        this.weapon = new bt.model.definitions.battle.weapon(this.weapon);
        if (angular.isDefined(this.weaponBonus)) {
            this.weaponBonus = new bt.model.definitions.battle.stone(this.weaponBonus);
        } else if ( (angular.isDefined(this.weapon_bonus)) && (angular.isDefined(this.weapon_bonus.stone)) && (angular.isDefined(this.weapon_bonus.stone.comp)) ) {
            this.weaponBonus = new bt.model.definitions.battle.cStone(this.weapon_bonus.stone);
        } else {
            this.weaponBonus = new bt.model.definitions.battle.stone();
        }
    },

    // Single grid tile definition
    tile : function(obj) {
        // Extend pased object
        if (obj) bt.model.extend(this, [new bt.model.definitions.battle.localized(obj), new bt.model.definitions.battle.cStone(obj)]);
        // Initialize children
        this.contents = [ ];
        this.units = { }
        for (var type in bt.model.common.units.definitions) {
            this.units[bt.model.common.units.definitions[type]] = [ ];
        }

        // Adds content to tile
        this.addContent = function(content) {
                this.contents.push(content);
                var type = bt.model.common.units.getDefinition(content._type);
                if (type) this.units[type].push(content);
            };
        // Removes content from tile
        this.removeContent = function(content) {
                for (var i in this.contents) if (this.contents[i] == content) this.contents.splice(i, 1);
                var type = bt.model.common.units.getDefinition(content._type);
                if (type) for (var i in this.units[type]) if (this.units[type][i] == content) this.units[type].splice(i, 1);
            };
        // Clears all title's content
        this.clearContent = function(content) {
                this.contents = [ ];
                var type = bt.model.common.units.getDefinition(content._type);
                if (type) this.units[type] = [ ];
            };

        this.isOwnedByPlayer = function() {
            for (var i in this.contents) {
                if (this.contents[i].owner == bt.game.authentication.username) return true;
            }
            return false;
            }
    },

    // Grid definition
    grid : function(obj) {

        // Initialization
        // ---------------------------------------------------------

        var base = this;

        // Extend pased object
        if (obj) bt.model.extend(this, [new bt.model.definitions.battle.cStone(obj)]);
        // Verify children
        if (bt.debugging.model.verifyModelConstructors) {
            if (!angular.isDefined(obj.x)) console.error(obj, 'Grid object definition incomplete: Missing X!');
            if (!angular.isDefined(obj.y)) console.error(obj, 'Grid object definition incomplete: Missing Y!');
        }
        // Initialize children
        this.size  = { x : obj.x, y : obj.y };
        this.tiles = [ ];
        this.tilesByX = [ ];
        this.tilesByY = [ ];

        // Adds a tile to the grid
        this.addTile = function(tile) {
            this.tiles.push(tile);
            if (!angular.isDefined(this.tilesByX[tile.location.x])) this.tilesByX[tile.location.x] = [];
            this.tilesByX[tile.location.x][tile.location.y] = tile;
            if (!angular.isDefined(this.tilesByY[tile.location.y])) this.tilesByY[tile.location.y] = [];
            this.tilesByY[tile.location.y][tile.location.x] = tile;
        }

        // Tiles manipulation
        // ---------------------------------------------------------

        // Gets all neighbouring tiles with distances from source less than radius and with no units in the way
        this.getNeighourTiles = function(sourceTile, radius, result) {
            // Initialize result
            if (!result) result = { };
            // Get neighbouring tiles
            var neighbouringTiles = [
                            { x : sourceTile.location.x - 1, y : sourceTile.location.y },
                            { x : sourceTile.location.x + 1, y : sourceTile.location.y },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1), y : sourceTile.location.y - 1 },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1) + 1, y : sourceTile.location.y - 1 },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1), y : sourceTile.location.y + 1 },
                            { x : sourceTile.location.x + (sourceTile.location.y % 2 == 1 ? 0 : -1) + 1, y : sourceTile.location.y + 1 }
                        ];
            // Get source radius
            var sourceTileId = sourceTile.location.x + 'x' + sourceTile.location.y;
            var sourceRadius = (result[sourceTileId] ? result[sourceTileId].radius : 0);
            // Process neighbouring tiles
            for (var i in neighbouringTiles) {
                var neighbouringTile = neighbouringTiles[i];
                var neighbouringTileId = neighbouringTile.x + 'x' + neighbouringTile.y;
                if ((base.tilesByX[neighbouringTile.x]) && (base.tilesByX[neighbouringTile.x][neighbouringTile.y]) && ((!result[neighbouringTileId]) || (result[neighbouringTileId].radius > (sourceRadius + 1)))) {
                    // Add tile to result
                    var resultTile = base.tilesByX[neighbouringTile.x][neighbouringTile.y];
                    resultTile.distance = sourceRadius + 1;
                    result[neighbouringTileId] = { radius : resultTile.distance, tile : resultTile };
                    // Process further neighbours
                    if ((radius > 1) && ((bt.config.game.battle.actions.jumpUnits) || (resultTile.contents.length == 0))) base.getNeighourTiles(resultTile, (radius - 1), result);
                }
            }
            // Return result
            return result;
        },

        // Moves content to new tile
        this.moveContent = function(content, targetLocation) {
            // Get content location
            var sourceLocation = content.location;
            // Get source and target tiles
            var sourceTile = this.tilesByX[sourceLocation.x][sourceLocation.y];
            var targetTile = this.tilesByX[targetLocation.x][targetLocation.y];
            // Move content
            if (sourceTile != targetTile) {
                sourceTile.removeContent(content);
                targetTile.addContent(content);
                if (this.selectedTile == sourceTile) this._selectTile(targetTile);
                content.updateLocation(targetLocation);
            }
        }

        // UI interpretation
        // ---------------------------------------------------------

        // Holds reference to selected tile
        this.selectedTile = null;
        this.processTileClick = function(battleService, tile) {
            // Check if tile is selectable
            if (tile.avaliableAction) {
                // Execute tile action
                this._executeActionOnTile(battleService, tile);
            } else {
                // Select or deselect tile
                if (tile != this.selectedTile) {
                    // Select tile
                    this._selectTile(tile);
                } else {
                    // Deselect tile
                    this._selectTile(null);
                }
            }
        }
        // Sets tile as selected
        this._selectTile = function(tile) {
            // Clear tiles' styles and actions
            for (var i in this.tiles) {
                this.tiles[i].style = null;
                this.tiles[i].avaliableAction = null;
                this.tiles[i].distance = null;
            }
            // Set selected tile
            this.selectedTile = tile;
            if (tile) this.selectedTile.style = bt.config.game.battle.styles.selected;
            if ((tile) && (tile.isOwnedByPlayer())) {
                // Calculate weapon attack radius
                var units = this.selectedTile.units[bt.model.common.units.definitions.scient];
                if (units.length > 0) {
                    var unit = units[0];
                    var weapon = unit.weapon;
                    if (weapon) {
                        var attackRadius = bt.model.common.weapons.getRange(weapon._type);
                        if (attackRadius) {
                            var minAttackRadius = attackRadius.min, maxAttackRadius = attackRadius.max;

                            // Set tiles' styles and actions
                            var nearTiles = base.getNeighourTiles(this.selectedTile, (maxAttackRadius > bt.config.game.battle.actions.moveRadius ? maxAttackRadius : bt.config.game.battle.actions.moveRadius));
                            for (var i in nearTiles) {
                                if ((nearTiles[i].tile != this.selectedTile)
                                    &&((nearTiles[i].tile.units[bt.model.common.units.definitions.scient].length > 0)
                                    && ((bt.config.game.battle.actions.friendlyFire) || (!nearTiles[i].tile.isOwnedByPlayer())))
                                    && ((nearTiles[i].radius >= minAttackRadius) && (nearTiles[i].radius <= maxAttackRadius))) {
                                    nearTiles[i].tile.style = bt.config.game.battle.styles.attack;
                                    nearTiles[i].tile.avaliableAction = 'attack';
                                } else if (nearTiles[i].tile.units[bt.model.common.units.definitions.scient].length == 0) {
                                    if  (nearTiles[i].radius <= bt.config.game.battle.actions.moveRadius) {
                                        nearTiles[i].tile.style = bt.config.game.battle.styles.move;
                                        nearTiles[i].tile.avaliableAction = 'move';
                                    }
                                    if ((nearTiles[i] != this.selectedTile) && (nearTiles[i].radius >= minAttackRadius) && ((nearTiles[i].radius <= maxAttackRadius))) {
                                        nearTiles[i].tile.style = (nearTiles[i].tile.style != bt.config.game.battle.styles.move ? bt.config.game.battle.styles.range : bt.config.game.battle.styles.moveInRange);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        // Sets tile as selected
        this._executeActionOnTile = function(battleService, tile) {
            if (tile.avaliableAction) {
                if (tile.avaliableAction == 'move') {
                    bt.game.battle.battleField.actions.move(battleService, this.selectedTile.units[bt.model.common.units.definitions.scient][0], tile);
                } else if (tile.avaliableAction == 'attack') {
                    bt.game.battle.battleField.actions.attack(battleService, this.selectedTile.units[bt.model.common.units.definitions.scient][0], tile);
                }
            }
        };

    },

    battleField : function(obj) {

        // Set base reference
        var base = this;

        // Initialization
        // ---------------------------------------------------------

        // Initialization section
        this.initialState = {

            // Initializes battle field from BattleService.init_state() response
            initialize : function(obj) {
                // Initialize grid
                this._initializeGrid(obj);
                // Initialize units
                this._initializeUnits(obj);
                // Initialize rest
                this._initializeOther(obj);
            },

            // Initializes battle field's grid from BattleService.init_state() response
            _initializeGrid : function(obj) {
                // Verify grid
                if (bt.debugging.model.verifyModelConstructors) {
                    if ((!angular.isDefined(obj.initial_state)) || (!angular.isDefined(obj.initial_state.grid)) || (!angular.isDefined(obj.initial_state.grid.grid)) || (!angular.isDefined(obj.initial_state.grid.grid.tiles))) console.error(obj, 'Grid object definition incomplete: Missing grid!');
                }
                // Initialize grid object
                base.grid = new bt.model.definitions.battle.grid(obj.initial_state.grid.grid);
                var tiles = obj.initial_state.grid.grid.tiles;
                // Insert tiles
                for (var x = 0; x < base.grid.size.x; x++) {
                    // Verify tiles
                    if (bt.debugging.model.verifyModelConstructors) {
                        if (!tiles[x]) console.error(obj, 'Grid object definition incomplete: Missing "x = ' + x + '" tiles!!');
                    }
                    // Insert tiles
                    for (var y = 0; y < base.grid.size.y; y++) {
                        // Verify tiles
                        if (bt.debugging.model.verifyModelConstructors) {
                            if (!tiles[x][y]) console.error(obj, 'Grid object definition incomplete: Missing "x = ' + x + '" tiles!!');
                        }

                        // Insert tiles
                        var tileDefinition = tiles[x][y].tile;
                        angular.extend(tileDefinition, { location: { x : x , y : y } });
                        var tile = new bt.model.definitions.battle.tile(tileDefinition);
                        base.grid.addTile(tile);

                    }
                }
            },

            // Initializes battle view's units from BattleService.init_state() response
            _initializeUnits : function(obj) {
                // Verify units
                if (bt.debugging.model.verifyModelConstructors) {
                    if ((!angular.isDefined(obj.initial_state)) || (!angular.isDefined(obj.initial_state.units))) console.error(obj, 'Grid object definition incomplete: Missing grid!');
                }
                // Initialize units collection
                base.units = new bt.model.definitions.battle.unitsCollection();
                // Insert units
                for (var id in obj.initial_state.units) {
                    for (var unitType in bt.model.common.units.definitions) {
                        if (angular.isDefined(obj.initial_state.units[id][bt.model.common.units.definitions[unitType]])) {

                            // Insert unit
                            var unitDefinition = obj.initial_state.units[id][bt.model.common.units.definitions[unitType]];
                            angular.extend(unitDefinition, { id : id });
                            if ((angular.isDefined(obj.initial_state.owners)) && (angular.isDefined(obj.initial_state.owners[id]))) angular.extend(unitDefinition, { owner : obj.initial_state.owners[id] });
                            var unit = new bt.model.definitions.battle[unitType](unitDefinition);
                            base.units.addUnit(unit);

                            // Add to grid
                            if (base.grid) base.grid.tilesByX[unit.location.x][unit.location.y].addContent(unit);

                        }
                    }
                }
            },

            // Initializes other properties from BattleService.init_state() response
            _initializeOther : function(obj) {
                // Verify units
                if (bt.debugging.model.verifyModelConstructors) {
                    if ((!angular.isDefined(obj.initial_state)) || (!angular.isDefined(obj.initial_state.player_names))) console.error(obj, 'Initial state definition incomplete: Missing players!');
                }
                // Initialize players
                base.players = obj.initial_state.player_names;
            }

        }
        this.initialState.initialize(obj);

        // Game status
        // ---------------------------------------------------------

        // Holds currently active player's username
        this.activePlayer = bt.game.authentication.username;

        // Holds current turn number
        this.turnNumber = 0;
        // Holds current action number
        this.actionNumber = 0;
        // Holds game over status
        this.gameOver = false;

    }


/*

    function Battlefield(grid, init_locs, owners) {
        "use strict";
        this.grid = new Grid(grid); // from json
        this.locs = init_locs;
        this.owners = owners;
        this.HPs = {};
        this.units = {};
        for (var key in this.locs) {
            var loc = this.locs[key];
            var unit = this.grid.tiles[loc[0]][loc[1]].contents;
            if (unit) {
              this.HPs[key] = unit.hp;
              this.units[unit.ID] = unit;
            }
        }
        this.graveyard = {};
        this.dmg_queue = {};
        this.direction = {
            0: 'North',
            1: 'Northeast',
            2: 'Southeast',
            3: 'South',
            4: 'Southwest',
            5: 'Northwest'
        };
        this.ranged = ['Bow', 'Magma', 'Firestorm', 'Forestfire', 'Pyrocumulus'];
        this.DOT = ['Glove', 'Firestorm', 'Icestorm', 'Blizzard', 'Pyrocumulus'];
        this.AOE = ['Wand', 'Avalanche', 'Icestorm', 'Blizzard', 'Permafrost'];
        this.Full = ['Sword', 'Magma', 'Avalanche', 'Forestfire', 'Permafrost'];

        //Grid operations
        //dumb port
        this.on_grid = function(tile) {
            if (0 <= tile[0] && tile[0] < this.grid.x) {
                if (0 <= tile[1] && tile[1] < this.grid.y) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        //DUMB port from hex_battlefield.py
        this.move_scient = function(unitID, dest) {
            //TODO test me
            ///move unit from src tile to dest tile
            var xsrc, ysrc, xdest, ydest = undefined;
            var src = this.locs[unitID];
            if (this.on_grid(src)) {
                xsrc = src[0];
                ysrc = src[1];
            } else {
                throw "Source " + src + " is off grid.";
            }
            if (this.on_grid(dest)) {
                xdest = dest[0];
                ydest = dest[1];
            } else {
                throw "Destination " + dest + " is off grid.";
            }
            if (this.grid.tiles[xsrc][ysrc].contents) {
                if (!this.grid.tiles[xdest][ydest].contents) {
                    var move = this.grid.tiles[xsrc][ysrc].contents.move;
                    var range = this.makeRange(src, move);
                    if (!range.add(dest)) {
                        this.grid.tiles[xdest][ydest].contents = this.grid.tiles[xsrc][ysrc].contents;
                        this.locs[unitID] = [xdest, ydest];
                        this.grid.tiles[xsrc][ysrc].contents = null;
                        return true;
                    } else {
                        throw "tried moving more than " + move + " tiles.";
                    }
                } else {
                    throw "There is already something at " + dest + ".";
                }
            } else {
                throw "There is nothing at " + src + ".";
            }
        };

        this.apply_dmg = function(unitID, amount) {
            var unit = this.units[unitID];
            if (typeof amount === "number") {
                unit.hp -= amount;
            } else if (amount === "Dead.") {
                unit.hp = 0;
            }
            if (unit.hp <= 0) {
                this.bury(unit);
            }
        };
        this.apply_HPs = function(HPs) {
            //Applies damage from last_state.
            for (var ID in HPs) {
              this.units[ID].hp = HPs[ID];
            }
        }
        this.apply_queued = function() {}; //getting this right will be tricky.
        this.bury = function(unit) {

            // ensure hp is non negative
            unit.hp = 0;

            // add to graveyard
            this.graveyard[unit.ID] = unit;

            // remove from units lookup
            delete this.units[unit.ID];

            // remove from damage queue
            //delete this.queued[unit.ID];

            // remove from grid tile
            this.grid.tiles[unit.location[0]][unit.location[1]].contents = null;

            // clear location?
            //unit.location = [-1, -1];
        };

        this.get_adjacent = function(tile, direction) {
            var direction = typeof direction !== 'undefined' ? direction : 'All';
            var xpos = tile[0];
            var ypos = tile[1];
            var directions = {
                "East": [
                    [xpos + 1, ypos], ],
                "West": [
                    [xpos - 1, ypos], ]
            };
            if (ypos & 1) {
                directions["North"] = [
                    [xpos + 1, ypos - 1],
                    [xpos, ypos - 1]
                ];
                directions["South"] = [
                    [xpos + 1, ypos + 1],
                    [xpos, ypos + 1]
                ];
                directions["Northeast"] = [
                    [xpos + 1, ypos - 1],
                    [xpos + 1, ypos]
                ];
                directions["Southeast"] = [
                    [xpos + 1, ypos + 1],
                    [xpos + 1, ypos]
                ];
                directions["Southwest"] = [
                    [xpos, ypos + 1],
                    [xpos - 1, ypos]
                ];
                directions["Northwest"] = [
                    [xpos, ypos - 1],
                    [xpos - 1, ypos]
                ];
            } else {
                directions["North"] = [
                    [xpos, ypos - 1],
                    [xpos - 1, ypos - 1]
                ];
                directions["South"] = [
                    [xpos, ypos + 1],
                    [xpos - 1, ypos + 1]
                ];
                directions["Northeast"] = [
                    [xpos, ypos - 1],
                    [xpos + 1, ypos]
                ];
                directions["Southeast"] = [
                    [xpos, ypos + 1],
                    [xpos + 1, ypos]
                ];
                directions["Southwest"] = [
                    [xpos - 1, ypos + 1],
                    [xpos - 1, ypos]
                ];
                directions["Northwest"] = [
                    [xpos - 1, ypos - 1],
                    [xpos - 1, ypos]
                ];
            }
            directions["All"] = [];
            directions["All"] = directions["All"].concat(directions["North"], directions["East"], directions["South"], directions["West"]);
            var out = new JS.Set();
            var idx, len;
            for (idx = 0, len = directions[direction].length; idx < len; idx++) {
                var loc = directions[direction][idx];
                if (this.on_grid(loc)) {
                    out.add(loc);
                }
            }
            return out;
        };
        //Nescient operations
        this.make_parts = function() {};
        this.make_body = function() {};
        this.body_on_grid = function() {};
        this.can_move_nescient = function() {};
        this.move_nescient = function() {};
        this.place_nescient = function() {};
        this.get_rotations = function() {};
        this.rotate = function() {};

        this.getUnitByLocation = function(location) {
            for (var u in this.units) {
                var unit = this.units[u];
                if (unit) {
                    if (_.isEqual(location, unit.location)) {
                        return unit;
                    }
                }
            }
        }

        // this should be done in GameState.init by computing a reverse lookup
        this.getUnitIdByLocation = function(location) {
            for (var id in this.locs) {
                var loc = this.locs[id];
                if (loc[0] === location[0] &&
                    loc[1] === location[1]) {
                    return id;
                }
            }
        }

        // weapon ops
        this.make_pattern = function(loc, distance, pointing) {
            //var tiles = [];
            var pattern = [];
            var head = this.get_adjacent(loc, pointing);
            var cols = 1;
            while (cols !== distance) {
                pattern = pattern.concat(head.toArray());
                var temp_head = head;
                head = new JS.Set();
                for (var tloc in temp_head) {
                    head.add(this.get_adjacent(tloc, pointing));
                }
                cols++;
            }
            return pattern;
        };

        this.tilesInRangeOfWeapon = function(loc, weapon) {
            var weaponHasRange = false;
            var weaponHasAOE = false;
            for (var w in this.ranged) {
                if (this.ranged[w] === weapon.wep_type) {
                    weaponHasRange = true;
                    break;
                }
            }
            for (var w2 in this.AOE) {
                if (this.AOE[w2] === weapon.wep_type) {
                    weaponHasAOE = true;
                    break;
                }
            }
            if (weaponHasRange) {
                var move = 4;
                var no_hit = this.makeRange(loc, move);
                var hit = this.makeRange(loc, 2 * move);
                return hit.difference(no_hit);
            } else if (weaponHasAOE) {
                var tiles = [];
                for (var x = 0; x < this.grid.x; x++) {
                    for (var y = 0; y < this.grid.y; y++) {
                        if (x !== loc[0] || y !== loc[1]) {
                            var pt = [x, y];
                            tiles.push();
                        }
                    }
                }
                return tiles;
            } else {
                return this.get_adjacent(loc);
            }
        };

        this.makeRange = function(location, distance) {
            var tilesets = [];
            tilesets.push(this.get_adjacent(location));
            while (tilesets.length < distance) {
                var tileset = tilesets.slice(-1)[0].entries().sort();
                var new_tileset = new JS.Set();
                for (var n in tileset) {
                    var tile = tileset[n];
                    new_tileset.merge(this.get_adjacent(tile));
                }
                tilesets.push(new_tileset);
            }
            var group = new JS.Set();
            for (var t in tilesets) {
                group = group.union(tilesets[t].entries().sort());
            }
            return group;
        };

        this.print = function() {
            for (var key in this.locs) {
                var loc = this.locs[key];
                this.HPs[key] = this.grid.tiles[loc[0]][loc[1]].contents.hp;
            }
            console.log("userID        Loc Owner HPs");
            for (var puserID in this.locs) {
                console.log("\t" + puserID + ": " + this.locs[puserID] + " " + this.owners[puserID] + "\t" + this.HPs[puserID]);        }
        };
    }

*/

}