app.factory('File', ['Central',
	function(Central) {
		var File = {};

		// on file read
		File.onFileRead = function(cluster,channel,reader,file){
			// file data uri
			file.data = reader.result;
	    	// get items file type
			file.file_type = this.splitByLastDot(file.name);
			// render item title
			file.title = file.name.split('.'+file.file_type)[0];
			// render file name
			file.file_name = this.renderFileName(cluster,channel,file);
			// if zip file, get inner file
			if (file.file_type === 'zip'){
				// js zip instance
				var zip = new JSZip();
				// js zip - loop through files in zip in file
				zip.loadAsync(file).then(function(zip) {
					file.zip_files = [];
					// for every file in zip
					for (var i in zip.files){ 
						var f = zip.files[i];
						file.zip_files.push(f);
						// if file is .com / .exe
						if (f.name.indexOf(".COM") > -1 || 
							f.name.indexOf(".EXE") > -1 || 
							f.name.indexOf(".com") > -1 ||
							f.name.indexOf(".exe") > -1){
							// inner file
							file.inner_file  = f.name;
						}
					}
				});
			}

			return file;
		};

		// split by last dot
		File.splitByLastDot = function(text){
		    var index = text.lastIndexOf('.');
		    var file_type = [text.slice(0, index), text.slice(index + 1)];
		    file_type = file_type[1].toLowerCase()
		    return file_type;
		};

		// check if file existing
		File.ifFileExist = function(file,items){
			var b = false;
			if (items){
				items.forEach(function(item,index){
					if (item.file_name === file.file_name){
						b = true;
					}
				});
			}
			return b;
		};

		// render file name
		File.renderFileName = function(cluster,channel,file){
			// file name
			var file_name = file.name.replace(/[\\/:"*?!§$~%&=ß<>|]/g,"").replace(/[{()}]/g, '').split(' ').join('_').split('.' + file.file_type)[0];
			// chinese / japanese / korean
			var cjk = /[\u3400-\u9FBF]/;
			if (cjk.test(file_name) || file_name.match(/[\u3400-\u9FBF]/i)){
				file_name = Central.generateRandomString(15);
			}
			// channel file path
			var file_path = 'data/users/'+channel.channel_address.split('_')[1]+'/'+file_name+'.'+file.file_type;
			cluster.site_files.forEach(function(s_file,index){
				if (s_file.inner_path === file_path){		
					file_name = file_name + '_1';
				}
			});
			file_name = file_name + '.' + file.file_type;
			return file_name;
		};
		return File;
	}
]);