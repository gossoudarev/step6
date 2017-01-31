/*jshint esversion: 6 */
/*jshint -W058 */

require('./bd/'); //требуем модуль с монго, который содержит глобальное объявление api.m





require('./server').start(result=>
	result?console.log(result):console.log('started')
);