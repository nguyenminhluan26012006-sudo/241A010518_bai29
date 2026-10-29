
window.onload = function () {
    khoiTaoDuLieu();

    var duongDan = window.location.pathname;
    var tenTrang = duongDan.substring(duongDan.lastIndexOf("/") + 1);

    if (tenTrang === "gv_tao_baitap.html") {
        xuLyTaoBaiTap();
    } else if (tenTrang === "gv_tao_dethi.html") {
        xuLyTaoDeThi();
    } else if (tenTrang === "sv_kiemtra.html") {
        xuLySinhVienLamBai("kiemtra");
    } else if (tenTrang === "sv_thi.html") {
        xuLySinhVienLamBai("thi");
    } else if (tenTrang === "gv_chamdiem.html") {
        xuLyChamDiem();
    }
};

// =========================================================
// 1. HÀM QUẢN LÝ DỮ LIỆU (LOCALSTORAGE)
// =========================================================
function khoiTaoDuLieu() {
    if (localStorage.getItem("jlh_baitap") === null) {
        var dsMau = [
            {
                ma: "D1", ten: "Tính tổng hai số nguyên", mucDo: "Dễ",
                moTa: "Nhập 2 số nguyên a, b. In ra tổng a + b.",
                tests: [
                    { input: "3 5", output: "8" },
                    { input: "-10 4", output: "-6" },
                    { input: "0 0", output: "0" },
                    { input: "1000000 2000000", output: "3000000" },
                    { input: "-5 -7", output: "-12" }
                ]
            },
            {
                ma: "D2", ten: "Kiểm tra số chẵn lẻ", mucDo: "Dễ",
                moTa: "Nhập số nguyên n. In ra CHAN nếu n chẵn, ngược lại LE.",
                tests: [
                    { input: "4", output: "CHAN" },
                    { input: "7", output: "LE" }
                ]
            }
        ];
        localStorage.setItem("jlh_baitap", JSON.stringify(dsMau));
    }

    if (localStorage.getItem("jlh_dethi") === null) {
        var dsDe = [
            { ma: "KT01", ten: "Kiểm tra 15 phút - Chương 1", loai: "kiemtra", baiTap: ["D1"] },
            { ma: "THI01", ten: "Thi giữa kỳ", loai: "thi", baiTap: ["D1", "D2"] }
        ];
        localStorage.setItem("jlh_dethi", JSON.stringify(dsDe));
    }

    if (localStorage.getItem("jlh_bainop") === null) {
        localStorage.setItem("jlh_bainop", JSON.stringify([]));
    }
}

function layDuLieu(key) {
    var chuoi = localStorage.getItem(key);
    if (chuoi === null) return [];
    return JSON.parse(chuoi);
}

function luuDuLieu(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// =========================================================
// 2. XỬ LÝ TRANG TẠO BÀI TẬP (gv_tao_baitap.html)
// =========================================================
function xuLyTaoBaiTap() {
    var form = document.querySelector('form[action="gv_tao_baitap_thanhcong.html"]');
    if (form === null) return;

    hienThiBangBaiTap();

    form.onsubmit = function (e) {
        e.preventDefault();

        var ma = document.getElementById("ma_bai").value;
        var ten = document.getElementById("tieu_de").value;
        var moTa = document.getElementById("mo_ta").value;
        
        var mucDo = "Dễ";
        if (document.getElementById("md_tb").checked === true) mucDo = "Trung bình";
        if (document.getElementById("md_kho").checked === true) mucDo = "Khó";

        var tests = [];
        for (var i = 1; i <= 5; i++) {
            var inp = document.getElementById("input_" + i).value;
            var out = document.getElementById("output_" + i).value;
            if (inp !== "" && out !== "") {
                tests.push({ input: inp, output: out });
            }
        }

        if (tests.length === 0) {
            alert("Vui lòng nhập ít nhất 1 bộ test!");
            return;
        }

        var dsCu = layDuLieu("jlh_baitap");
        for (var j = 0; j < dsCu.length; j++) {
            if (dsCu[j].ma === ma) {
                alert("Mã bài tập này đã tồn tại!");
                return;
            }
        }

        var baiMoi = { ma: ma, ten: ten, mucDo: mucDo, moTa: moTa, tests: tests };
        dsCu.push(baiMoi);
        luuDuLieu("jlh_baitap", dsCu);

        alert("Đã lưu bài tập thành công!");
        form.reset();
        hienThiBangBaiTap();
    };
}

function hienThiBangBaiTap() {
    var tbody = document.querySelector("table tbody");
    if (tbody === null) return;

    var ds = layDuLieu("jlh_baitap");
    var html = "";
    
    if (ds.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7'>Chưa có bài tập.</td></tr>";
        return;
    }

    for (var i = 0; i < ds.length; i++) {
        var b = ds[i];
        var icon = "🟢 Dễ";
        if (b.mucDo === "Trung bình") icon = "🟡 Trung bình";
        if (b.mucDo === "Khó") icon = "🔴 Khó";
        
        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + b.ma + "</td>";
        html += "<td>" + b.ten + "</td>";
        html += "<td>" + icon + "</td>";
        html += "<td>" + b.tests.length + "</td>";
        html += "<td>" + (b.tests.length * 2) + "</td>";
        html += "<td><a href='#' onclick='xoaBaiTap(\"" + b.ma + "\")'>Xóa</a></td>";
        html += "</tr>";
    }
    tbody.innerHTML = html;
}

function xoaBaiTap(ma) {
    if (confirm("Bạn có chắc muốn xóa bài " + ma + "?") === false) return;
    
    var ds = layDuLieu("jlh_baitap");
    var dsMoi = [];
    for (var i = 0; i < ds.length; i++) {
        if (ds[i].ma !== ma) dsMoi.push(ds[i]);
    }
    luuDuLieu("jlh_baitap", dsMoi);
    hienThiBangBaiTap();
}

// =========================================================
// 3. XỬ LÝ TRANG TẠO ĐỀ THI (gv_tao_dethi.html)
// =========================================================
function xuLyTaoDeThi() {
    var form = document.querySelector('form[action="gv_tao_dethi_thanhcong.html"]');
    if (form === null) return;

    form.onsubmit = function (e) {
        e.preventDefault();

        var ma = document.getElementById("ma_de").value;
        var ten = document.getElementById("ten_de").value;
        var laKiemTra = document.getElementById("loai_kt").checked;
        var laThi = document.getElementById("loai_thi").checked;

        if (laKiemTra === false && laThi === false) {
            alert("Vui lòng chọn loại đề!");
            return;
        }

        var dsChon = [];
        var checkboxes = document.querySelectorAll('input[name="bai_chon"]');
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked === true) {
                dsChon.push(checkboxes[i].value);
            }
        }

        if (laKiemTra === true && dsChon.length !== 1) {
            alert("Đề Kiểm tra chỉ được chọn 1 bài!");
            return;
        }
        if (laThi === true && (dsChon.length < 2 || dsChon.length > 3)) {
            alert("Đề Thi phải chọn từ 2 đến 3 bài!");
            return;
        }

        var loai = "kiemtra";
        if (laThi === true) loai = "thi";

        var dsDe = layDuLieu("jlh_dethi");
        for (var j = 0; j < dsDe.length; j++) {
            if (dsDe[j].ma === ma) {
                alert("Mã đề này đã tồn tại!");
                return;
            }
        }

        var deMoi = { ma: ma, ten: ten, loai: loai, baiTap: dsChon };
        dsDe.push(deMoi);
        luuDuLieu("jlh_dethi", dsDe);

        alert("Đã lưu đề thi!");
        form.reset();
    };
}

// =========================================================
// 4. XỬ LÝ TRANG SINH VIÊN LÀM BÀI
// =========================================================
function xuLySinhVienLamBai(loaiDe) {
    var url = window.location.search;
    var params = new URLSearchParams(url);
    var mssvUrl = params.get("mssv");
    var hotenUrl = params.get("hoten");

    if (mssvUrl !== null) {
        if (document.getElementById("nop_mssv") !== null) document.getElementById("nop_mssv").value = mssvUrl;
        if (document.getElementById("mssv") !== null) document.getElementById("mssv").value = mssvUrl;
    }
    if (hotenUrl !== null) {
        if (document.getElementById("nop_hoten") !== null) document.getElementById("nop_hoten").value = hotenUrl;
        if (document.getElementById("hoten") !== null) document.getElementById("hoten").value = hotenUrl;
    }

    var form = document.querySelector('form[action="sv_ketqua.html"]');
    if (form === null) return;

    form.onsubmit = function (e) {
        e.preventDefault();

        var mssv = "";
        if (document.getElementById("nop_mssv") !== null) mssv = document.getElementById("nop_mssv").value;
        else if (document.getElementById("mssv") !== null) mssv = document.getElementById("mssv").value;

        var hoten = "";
        if (document.getElementById("nop_hoten") !== null) hoten = document.getElementById("nop_hoten").value;
        else if (document.getElementById("hoten") !== null) hoten = document.getElementById("hoten").value;

        if (mssv === "" || hoten === "") {
            alert("Vui lòng nhập MSSV và Họ tên!");
            return;
        }

        var maBai = "";
        if (loaiDe === "kiemtra") {
            maBai = document.getElementById("nop_ma_bai").value;
            if (maBai === "") {
                alert("Vui lòng chọn bài tập!");
                return;
            }
        } else {
            maBai = document.getElementById("ma_bai_1").value;
            if (maBai === "") {
                alert("Vui lòng nhập mã bài!");
                return;
            }
        }

        // Giả lập chấm điểm: Nếu code có chứa "public class" thì đạt 10 điểm
        var code = "";
        if (document.getElementById("nop_code") !== null) code = document.getElementById("nop_code").value;
        else if (document.getElementById("code_1") !== null) code = document.getElementById("code_1").value;

        var diem = 0;
        if (code.indexOf("public class") >= 0) {
            diem = 10;
        } else if (code.length > 0) {
            diem = 4;
        }

        var dsNop = layDuLieu("jlh_bainop");
        var baiNop = {
            mssv: mssv, hoten: hoten, loai: loaiDe, maBai: maBai,
            diem: diem, trangThai: "Chờ chấm",
            thoiGian: new Date().toLocaleString("vi-VN")
        };
        dsNop.push(baiNop);
        luuDuLieu("jlh_bainop", dsNop);

        window.location.href = "sv_ketqua.html";
    };
}

// =========================================================
// 5. XỬ LÝ TRANG CHẤM ĐIỂM (gv_chamdiem.html)
// =========================================================
function xuLyChamDiem() {
    var form = document.querySelector('form[action="gv_chamdiem_thanhcong.html"]');
    if (form === null) return;

    hienThiBangBaiNop();

    form.onsubmit = function (e) {
        e.preventDefault();

        var mssv = document.getElementById("cham_mssv").value;
        var hoten = document.getElementById("cham_hoten").value;
        var de = document.getElementById("cham_de").value;
        var tongDiem = document.getElementById("tong_diem").value;

        if (mssv === "" || hoten === "" || de === "") {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }

        var dsNop = layDuLieu("jlh_bainop");
        var timThay = false;

        for (var i = 0; i < dsNop.length; i++) {
            if (dsNop[i].mssv === mssv) {
                dsNop[i].diem = parseInt(tongDiem);
                dsNop[i].trangThai = "Đã chấm";
                timThay = true;
                break;
            }
        }

        if (timThay === false) {
            dsNop.push({
                mssv: mssv, hoten: hoten, loai: "N/A", maBai: de,
                diem: parseInt(tongDiem), trangThai: "Đã chấm",
                thoiGian: new Date().toLocaleString("vi-VN")
            });
        }

        luuDuLieu("jlh_bainop", dsNop);
        alert("Đã lưu điểm!");
        form.reset();
        hienThiBangBaiNop();
    };
}

function hienThiBangBaiNop() {
    var table = document.querySelector("table");
    if (table === null) return;
    var tbody = table.querySelector("tbody");
    if (tbody === null) return;

    var ds = layDuLieu("jlh_bainop");
    var html = "";

    if (ds.length === 0) {
        tbody.innerHTML = "<tr><td colspan='9'>Chưa có bài nộp.</td></tr>";
        return;
    }

    for (var i = 0; i < ds.length; i++) {
        var b = ds[i];
        var trangThai = "⏳ Chờ chấm";
        if (b.trangThai === "Đã chấm") trangThai = "✅ Đã chấm";

        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + b.mssv + "</td>";
        html += "<td>" + b.hoten + "</td>";
        html += "<td>" + b.loai + "</td>";
        html += "<td>" + b.maBai + "</td>";
        html += "<td>" + b.thoiGian + "</td>";
        html += "<td>" + (b.trangThai === "Đã chấm" ? b.diem : "—") + "</td>";
        html += "<td>" + trangThai + "</td>";
        html += "<td><a href='#form-cham'>Chấm</a></td>";
        html += "</tr>";
    }
    tbody.innerHTML = html;
}