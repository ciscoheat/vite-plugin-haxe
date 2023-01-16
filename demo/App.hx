package;

import mithril.M;
import js.Browser;

class App {
	static function main() {
		var routes = {
			'/': TestPage,
			'/another': AnotherPage
		};

		M.route.route(Browser.document.getElementById('app'), '/', routes);
	}
}

class TestPage implements Mithril {
	public static function view() {
		m("div", [
			m("a[href='https://vitejs.dev'][target='_blank']", m("img.logo[src='/vite.svg'][alt='Vite logo']")),
			m("a[href='https://haxe.org/'][target='_blank']", m("img.logo.vanilla[src='/haxe.svg'][alt='Haxe logo']")),
			m("h1", "Vite + Haxe"),
			m("p.read-the-docs", m(M.route.Link, {
				href: '/another'
			}, "Another page"))
		]);
	}
}

class AnotherPage implements Mithril {
	public static function view() {
		m("div", [
			m("img.logo.vanilla[src='/haxe.svg'][alt='Haxe logo']"),
			m("p.read-the-docs", m(M.route.Link, {href: '/'}, "Back to start"))
		]);
	}
}
