namespace $.$$ {
	export class $hyoo_when extends $.$hyoo_when {

		new_link() {
			return `#!meet=${ $mol_guid() }`
		}
		
		@ $mol_mem
		meet() {
			
			const id = this.$.$mol_state_arg.value( 'meet' )
			if( !id ) return null
			
			return this.store().doc( `meet=${ id }` )
			
		}

		@ $mol_mem
		descr( next?: string ) {
			return this.meet()?.sub( 'descr' ).text( next ) ?? ''
		}

		@ $mol_mem_key
		person( id: number ) {
			return this.store().doc( `person=${ id }` )
		}

		@ $mol_mem_key
		person_name( id: number, next?: string ) {
			return String( this.person( id ).sub( 'name' ).value( next ) ?? '' )
		}

		@ $mol_mem_key
		joined_available( peer: number, next?: string[] ) {
			return this.meet()?.sub( 'available' ).sub( String( peer ) ).list( next ).map( String ) ?? []
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
		
		schedule( next?: boolean ) {
			const arg = next === undefined ? undefined : next ? '' : null
			return this.$.$mol_state_arg.value( 'schedule', arg ) !== null
		}
		
		override chat_seed() {
			return '#!meet=' + this.$.$mol_state_arg.value( 'meet' )
		}
		
		@ $mol_mem
		pages() {
			return [
				this.Main(),
				... this.schedule() ? [ this.Schedule() ] : [],
				... this.chat_pages(),
			]
		}
		
		@ $mol_mem
		joined( next?: number[] ): any[] {
			return this.meet()?.sub( 'joined' ).list( next ).map( Number ) ?? []
		}
		
		@ $mol_mem
		join( next?: boolean ) {
			
			let joined = this.joined()
			const peer = this.store().peer()

			if( next === undefined ) return joined.includes( peer )
			
			if( next ) {
				joined = this.joined([ ... new Set([ ... joined, peer ]) ])
				this.schedule( true )
			} else if( next === false ) {
				joined = this.joined( joined.filter( p => p !== peer ) )
			}
			
			return joined.includes( peer )
		}
		
		@ $mol_mem
		joined_names() {
			return this.joined().map( id => this.Joined_name( id ) )
		}
		
		joined_name( id: number ) {
			return this.person_name( id ) || `#${ id.toString( 36 ) }`
		}
		
		name( next?: string ) {
			return this.person_name( this.store().peer(), next )
		}
		
		@ $mol_mem
		joined_allowed() {
			return this.joined().filter( peer => this.joined_allow( peer ) )
		}
		
		@ $mol_mem
		bingos() {
			
			const joined = this.joined_allowed()
			if( !joined.length ) return new Set< string >()
			
			const suspect = new Set( this.joined_available( joined[0] ) )
			for( const other of joined.slice(1) ) {
				const available = new Set( this.joined_available( other ) )
				for( const day of suspect ) {
					if( !available.has( day ) ) suspect.delete( day )
				}
			}
			
			return suspect
		}
		
		@ $mol_mem_key
		day_bingo( day: string ) {
			return this.bingos().has( day )
		}
		
		@ $mol_mem_key
		day_selected( day: string, next?: boolean ) {
			
			const peer = this.store().peer()
			let available = this.joined_available( peer ) as any[]
			if( next === undefined ) return available.includes( day )
			
			available = this.joined_available( peer, next
				? [ ... new Set([ ... available, day ]) ]
				: available.filter( d => d !== day )
			)
			
			this.join( available.length > 0 )
			
			return next
		}
		
		day_click( day: string ) {
			this.day_selected( day, !this.day_selected( day ) )
		}

	}
}
