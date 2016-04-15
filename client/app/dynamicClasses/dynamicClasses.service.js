'use strict';

angular
	.module('transitApp')
  	.service('dynamicElement', dynamicElement);

dynamicElement.$inject = [];

function dynamicElement() {

	var DynamicElement = function(defaultClasses) {
		//declare local variables
		this.defaultClasses = defaultClasses;
		this.classes = {};
		this.styles = {};
		this.message = '';
		this.clickable = false;

		//run the constructor
		this._constructor();
	};

	DynamicElement.prototype._constructor = function() {
		//define the local
		var parent = this;

		//run through each default and set it's value as true
		this.defaultClasses.forEach(function(thisClass) {
			
			if(typeof thisClass === 'object') {
				Object.keys(thisClass).forEach(function(key) {
					parent.classes[key] = thisClass[key];
				});
			}
			//set each of the defaults to true
			parent.classes[thisClass] = true;
		});

	};

	DynamicElement.prototype.addNewClass = function(newClass) {
		this.classes[newClass] = true;
	};

	DynamicElement.prototype.updateClass = function(targetClass, newValue) {
		this.classes[targetClass] = newValue;
	};

	DynamicElement.prototype.updateStyle = function(targetStyle, newValue) {
		this.styles[targetStyle] = newValue;
	};
	
	DynamicElement.prototype.flipClass = function(targetClass) {
		this.classes[targetClass] = !this.classes[targetClass];
	};

	DynamicElement.prototype.removeClass = function(targetClass) {
		delete this.classes[targetClass];
	};

	DynamicElement.prototype.flipActiveBtn = function() {
		this.flipClass('btn-success');
		this.flipClass('btn-default');
		this.flipClass('disabled');
	};

	DynamicElement.prototype.successfulInput = function() {
		this.updateClass('has-success', true);
		this.updateStyle('color', 'green');
	};

	DynamicElement.prototype.defaultInput = function() {
		this.updateClass('has-success', false);
		this.updateStyle('color', '#555555');
	};

	return DynamicElement;
}