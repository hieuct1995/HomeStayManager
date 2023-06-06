const qs = require('qs');
const url = require('url');

const BaseController = require('./base.controller');
const homestayModel = require('./../model/homestay.model');

class HomeStayController {
    static async getDisplayHomestayPage(req, res) {
        if (req.method == 'GET') {
            let data = await homestayModel.getAllHomestay();
            let newHtml = '';
            data.forEach((homestay,index) => {
                newHtml += `<tr>`;
                newHtml += `<td>${index + 1}</td>`;
                newHtml += `<td><a href='/detail?id=${homestay.id}'>${homestay.name}</a></td>`;
                newHtml += `<td>${homestay.nameCity}</td>`;
                newHtml += `<td>${homestay.price}</td>`;
                newHtml += `<td>
                <button class='btn btn-primary'><a href='/update?id=${homestay.id}' class="text-decoration-none" style="color: white;">Sửa</a></button>
                <button class='btn btn-danger'><a href='/delete?id=${homestay.id}' class="text-decoration-none" style="color: white;">Xóa</a></button>
                </td>`
            });
            let html = await BaseController.readFileData('./src/views/display.html');
            html = html.replace('{list-homestay}', newHtml);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }
    }

    static async getDetailPage(req, res) {
        let query = qs.parse(url.parse(req.url).query);
        if (query.id && req.method == 'GET') {
            let data = await homestayModel.getDetailHomestay(+query.id);
            let {id, name, num_bedroom, num_badroom, price, descript, nameCity} = data[0];
            let html = await BaseController.readFileData('./src/views/detail.html');
            let newHtml = '';
            newHtml += `<button class='btn btn-primary'><a href='/update?id=${id}'class="text-decoration-none" style="color: white;">Sửa</a></button>
            <button class='btn btn-danger'><a href='/delete?id=${id}'class="text-decoration-none" style="color: white;">Xóa</a></button>`
            html = html.replace('{name1}', name);
            html = html.replace('{name2}', name);
            html = html.replace('{city}', nameCity);
            html = html.replace('{num_bedroom}', num_bedroom);
            html = html.replace('{num_badroom}', num_badroom);
            html = html.replace('{price}', price);
            html = html.replace('{descript}', descript);
            html = html.replace('{btn-content}', newHtml);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }
    }

    static async addHomestay(req, res) {
        if (req.method == 'GET') {
            let html = await BaseController.readFileData('./src/views/add.html');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', async () => {
                data = qs.parse(data);
                let {name, idCity, num_bedroom, num_badroom, price, descript} = data;
                await homestayModel.addHomeStay(name, +idCity, +num_bedroom, +num_badroom, +price, descript);
                res.writeHead(301, {location: '/'});
                res.end();
            })
            
        }
    }
}

module.exports = HomeStayController;