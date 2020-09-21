namespace $.$$ {
	export class $hyoo_when extends $.$hyoo_when {

		new_link() {
			return `#room=${ Math.random().toString(36).substring(2) }`
		}

		calendars_after( prev : $mol_time_moment ) {

			return [
				prev
					? prev.shift({ month : 1 })
					: new $mol_time_moment().mask('0000-00')
			]

		}

		calendar_month( month : $mol_time_moment ) {
			return month
		}

	}
}
