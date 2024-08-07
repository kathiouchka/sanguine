// autogenerated file

package service

import (
	"github.com/synapsecns/sanguine/services/rfq/relayer/reldb"
)

// iOtelRecorder ...
type iOtelRecorder interface {
	// RecordStatusCount records the request status count.
	RecordStatusCount(status reldb.QuoteRequestStatus, count int)
}
