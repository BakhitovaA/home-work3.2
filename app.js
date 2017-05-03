const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/notebook';

MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Невозможно подключиться к серверу MongoBD. Ошибка: ', err);
	} else {
		console.log('Подключение к: ', url);
		
		var collection = db.collection('notebook');
		
		//Отображение
		app.get("/notebook/", function(req, res) {
			collection.find({}).toArray(function (err, result) {
				if (err) {
					console.log(err);
				} else  {
					if (result.length) {
						res.send(result)
					} else {
						res.send('Отсутствуют записи в справочнике');
					}
				}
			});
		});
		
		//Добавление
		app.get("/notebook/add/", function(req, res) {	
			console.log('Добавляем', req.query.name, req.query.surname, req.query.phone);
			let user = {name : req.query.name, surname : req.query.surname, phone : req.query.phone}
			collection.insert([user]) 		
			res.send('Добавленный контакт: ' + req.query.name + ' ' + req.query.surname + ' ' + req.query.phone)
		});
			
		//Редактирование информации
		app.get("/notebook/remove/", function(req, res) {
			console.log('Редактируем', req.query.name, req.query.surname, req.query.phone);
			if (req.query.name == undefined) {
				res.status(500).json({ error: 'Не найден контакт для редактирования' });
			} else {
				if (req.query.surname !== undefined && req.query.phone !== undefined) {
					collection.update({id : req.params.id},{'$set':{name : req.query.name, surname : req.query.surname, phone : req.query.phone}});
					res.send('Обновленный контакт: ' + req.query.name + ' ' + req.query.surname + ' ' + req.query.phone)
				} else {
					if (req.query.surname !== undefined) {
						collection.update({id : req.params.id},{'$set':{name : req.query.name, surname : req.query.surname}});
						res.send('Обновленный контакт: ' + req.query.name + ' ' + req.query.surname + ' ' + req.query.phone)
					} else {
						if (req.query.phone !== undefined) {
							collection.update({id : req.params.id},{'$set':{name : req.query.name, phone : req.query.phone}});
							res.send('Обновленный контакт: ' + req.query.name + ' ' + req.query.phone + ' ' + req.query.phone)
						}
					}
				}
			}
		});

		//Удаление информации
		app.get("/notebook/delete", function(req, res) {
			console.log('Удаляем', req.query.name, req.query.surname, req.query.phone);
			if (req.query.name == undefined) {
				res.status(500).json({ error: 'Не найден объект для удаления' });
			} else {
				collection.remove({name : req.query.name});
				res.send('Удален контакт: ' + req.query.name + ' ' + req.query.phone + ' ' + req.query.phone)
			}
		});	

		//Поиск
		app.get("/notebook/find/", function(req, res) {
			console.log('Ищем', req.query.name, req.query.surname, req.query.phone);
			if (req.query.name !== undefined && req.query.surname !== undefined && req.query.phone !== undefined) {
				collection.find({
					$or : [ {name : req.query.name}, {surname : req.query.surname}, {phone : req.query.phone} ]
				}).toArray(function (err, result) {
					if (err) {
						console.log(err);
						res.status(500).json({ error: 'Не найдено' });
					} else  {
						if (result.length) {
							res.send(result)
						} else {
							res.send('Не найдено контактов по заданным условиям поиска');
						}
					}
				});
			} else {
				if (req.query.name !== undefined && req.query.surname !== undefined) {
					collection.find({
						$or : [ {name : req.query.name}, {surname : req.query.surname}]
					}).toArray(function (err, result) {
						if (err) {
							console.log(err);
							res.status(500).json({ error: 'Не найдено' });
						} else  {
							if (result.length) {
								res.send(result)
							} else {
								res.send('Не найдено контактов по заданным условиям поиска');
							}
						}
					});
				} else {
					if (req.query.name !== undefined && req.query.phone !== undefined) {
						collection.find({
							$or : [ {name : req.query.name}, {phone : req.query.phone}]
						}).toArray(function (err, result) {
							if (err) {
								console.log(err);
								res.status(500).json({ error: 'Не найдено' });
							} else  {
								if (result.length) {
									res.send(result)
								} else {
									res.send('Не найдено контактов по заданным условиям поиска');
								}
							}
						});
					} else {
						if (req.query.surname !== undefined && req.query.phone !== undefined) {
							collection.find({
								$or : [ {surname : req.query.surname}, {phone : req.query.phone}]
							}).toArray(function (err, result) {
								if (err) {
									console.log(err);
									res.status(500).json({ error: 'Не найдено' });
								} else  {
									if (result.length) {
										res.send(result)
									} else {
										res.send('Не найдено контактов по заданным условиям поиска');
									}
								}
							});
						} else {
							if (req.query.name !== undefined) {
								collection.find({
									$or : [{name : req.query.name}]
								}).toArray(function (err, result) {
									if (err) {
										console.log(err);
										res.status(500).json({ error: 'Не найдено' });
									} else  {
										if (result.length) {
											res.send(result)
										} else {
											res.send('Не найдено контактов по заданным условиям поиска');
										}
									}
								});
							} else {
								if (req.query.surname !== undefined) {
									collection.find({
										$or : [{surname : req.query.surname}]
									}).toArray(function (err, result) {
										if (err) {
											console.log(err);
											res.status(500).json({ error: 'Не найдено' });
										} else  {
											if (result.length) {
												res.send(result)
											} else {
												res.send('Не найдено контактов по заданным условиям поиска');
											}
										}
									});
								} else {
									if (req.query.phone !== undefined) {
										collection.find({
											$or : [{phone : req.query.phone}]
										}).toArray(function (err, result) {
											if (err) {
												console.log(err);
												res.status(500).json({ error: 'Не найдено' });
											} else  {
												if (result.length) {
													res.send(result)
												} else {
													res.send('Не найдено контактов по заданным условиям поиска');
												}
											}
										});
									}
								}
							}
						}
					}
				}
			}
		});	
		
	}
})

app.listen(3000, function () {
	console.log('Подключение к порту 3000');
});