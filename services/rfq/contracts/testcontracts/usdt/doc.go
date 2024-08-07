// Package usdt contains a tether contract. Note: because of how deprecated the tether contract is
// (we use a reconstructed version of the decompiled contract here): https://gist.github.com/plutoegg/a8794a24dfa84d0b0104141612b52977
// which indicates tether was build with solidity 0.4.11, we can't use abigen in our normal way to generate the abigen.
// In more recent version of solidity, when solc cannot be installed (because of os constraints, etc) we can sue one of the docker images
// provided here: https://hub.docker.com/layers/ethereum/solc/0.4.11/images/?context=explore
//
// However the image used is so old, it lacks the hashes options on --combined-json added here: https://github.com/ethereum/solidity/pull/2382
// for this reason, the solc command must be manually modified and pass hashes in separately, like so:
//
//	docker run -v $(pwd):/solidity ethereum/solc:0.4.11  --combined-json bin,bin-runtime,srcmap,srcmap-runtime,abi,userdoc,devdoc,metadata --hashes --optimize --allow-paths ., ./,  -- ./TetherToken.sol
//
// the output resembles the modern json output, but each contract key (in contracts) is now missing `hashes`. The hashes
// have, however been printed below in the following format:
//
// ======= ./TetherToken.sol:ERC20Basic =======
// Function signatures:
// 18160ddd: totalSupply()
//
// and so on for each contract. These hashes were manually converted to json by adding quotes and wrapping them in parentheses
// and added to each contract. Note: unlike abi or devdoc, these are not normalized, so in the above example these are added as such:
//
//	"./TetherToken.sol:ERC20Basic": {
//			[other code generated by above command]
//	     "hashes": {
//	          "18160ddd": "totalSupply()",
//	          [other hashes]
//	     }
//	}
//
// finally, in generate.go due to a difference in the way function signature generation is done between the versions, a --alias=_totalSupply=underTotalSupply
// we then substitute this manually produced file into solc and interpret the solc as we would manually
package usdt
