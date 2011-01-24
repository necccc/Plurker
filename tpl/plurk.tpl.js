plurker.tpl.plurk = '<li>' +
	'<% if (lazy) { %>' +
		'<div class="owner lazy">' +
			'<img src="" alt="" /><br />' +
			'<strong></strong>' +
		'</div>' +
	'<% } else { %>' +
		'<div class="owner">' +
			'<img src="<%= avatar %>" alt="<%= owner %>" /><br />' +
			'<strong><%= owner %></strong>' +
		'</div>' +
	'<% } %>' +
	'<%= content %>' +
'</li>';