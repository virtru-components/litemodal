LiteModal Modal Framework (jQuery plugin: work-in-progress)
========================

This utility provides a modal dialog plugin.

At the present time (06/25/2013), this plugin is functional as a pre-Alpha
SW. 

For certain features, it is meant to provide some basic plug-and-play 
compatibility with SimpleModal. 

However, it is not meant to match SimpleModal feature-for-feature, but only to
match certain features that Virtru is currently using.

It is pre-Alpha mainly since it hasn't been extensively tested as a plugin
for the Virtru API. However, it has been tested for functionality on the 
features that it is meant to serve (as replacement for SimpleModal).

It also offers certain features that (may be or) may not be in SimpleModal.
Again, this module was only written as a quick replacement and (most emphatically)
still needs more development in terms of features and capabilities.


Basic Architecture
------------------

(Doc still TBD)


Project Structure
-----------------

The project is organized into the following directories:
    
- ``lib`` - Contains all of the js components for the project. 
- ``tests`` - Is meant to provide certain sample test-codes as well as 
         sample codes.
- ``templates`` - Contains some templates that are used. (this may change)
- ``css`` - Contains the 'built-in' style-sheets used by the plugin.
         (this may also change in the future)

Module Dependencies
----------

The plugin is dependent on:
 - ComponentJS
 - jQuery 
 - Component/emitter

Other Required Packages
^^^^^^^^^^^^^^^^^^^^^^^^


Project dependencies
^^^^^^^^^^^^^^^^^^^^


Building
--------

A Makefile is provided, so simply type:
- make

This will create the files:
- build/build.js
- build/build.css

These files are referenced by the samples below.
 
Examples
-----------------

There are currently 2 html files that shows some of the features.

More samples will hopefully be created later, as well as improving this document.


Author: Ramon C. Gonzales - (c) 2013, for Virtru Corporation
----------------------

