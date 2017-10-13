app.factory('Vote', [
	function() {
		var Vote = {};
		
		Vote.renderDataOnItemVote = function(data,item,vote_type,user_id){
			// render data object
			if (data) { 
				data = JSON.parse(data); 
				if (!data.vote){
					data.vote = [];
					next_vote_id = 1;
				}
			}
			else { 
				data = {"next_vote_id":1,"vote":[]}; 
			}
			// up / down vote
			if (vote_type === "up" || vote_type === "down"){
				var vote = {
					vote_id:item.item_id + '_v_' + data.next_vote_id,
					item_id:item.item_id,
					user_id:user_id,
					date_added:+(new Date)
				};
				if (vote_type === "up") vote.vote = 1;
				else if (vote_type === "down") vote.vote = 0;
				data.next_vote_id += 1;
				data.vote.push(vote);
			} 
			// change / delete vote
			else if (vote_type === "change" || vote_type === "delete"){
				// get vote from item votes array
				var voteId;
				var voteType;
				item.votes.forEach(function(vote,index){
					if (vote.user_id === user_id){
						voteId = vote.vote_id;
						voteType = vote.vote;
					}
				});
				// find vote index in data.json votes array
				var voteIndex;
				data.vote.forEach(function(vote,index){
					if (vote.vote_id === voteId){
						voteIndex = index;
						// if vote_type is change, change the vote Type of vote
						if (vote_type === "change"){
							if (vote.vote === 1) vote.vote = 0;
							else if (vote.vote === 0) vote.vote = 1;
						}
					}
				});
				// if vote_type is delete, remove vote from data.vote array
				if (vote_type === "delete"){
					data.vote.splice(voteIndex,1);
				}
			}
			console.log(data.vote);
			return data;
		};

		return Vote;
	}
]);