import axios from "axios";

export const request=axios.create({
	baseURL:"/admin/api/",
	headers:{
		Accept: 'application/json',
		'X-Requested-With': 'XMLHttpRequest'
	}
});
