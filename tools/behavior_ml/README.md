# Offline behavior model

Train on an organizer-controlled Mac, Windows or Linux Python environment. The
production service loads `engine/models/behavior-forest.json` with standard
library inference. It never installs scikit-learn or unpickles a model.

The private input folder contains authenticated `<id>.meta.json` and
`<id>.frames` caches. An organizer-confirmed label ledger maps IDs to `label`
(0 human, 1 automated/forged, null unknown), `family`, `source`, and optional
`holdout: true`. Unknown records and explicit holdouts never enter fitting.
Labels must come from confirmed provenance, not the current leaderboard or old
judge verdicts. Do not publish original proofs, private caches or label ledgers.

```sh
python -m venv .training-venv
.training-venv/bin/pip install -r tools/behavior_ml/requirements.txt
.training-venv/bin/python tools/behavior_ml/train.py \
  --records /private/recording-caches --labels /private/labels.json \
  --output engine/models/behavior-forest.json --report /private/training-report.json \
  --parity-output tests/data/behavior-model-vectors.json
```

The artifact contains two 160-tree, depth-5 random forests, one per input
transport (`held` or `pulse`). They use the same 34 control statistics from
non-overlapping 30-second active-time windows. IDs, names, seeds, scores, route
optima, OS labels and clock provenance are excluded. Body-key preference,
center-line preference and move/look overlap are excluded as style shortcuts.
Three eligible moving windows must agree before a learned deduction occurs.
Key-transition count remains a feature and is no longer an eligibility filter;
a held key can cover many cells without a transition. Training and inference
share the same window selector. The forest weights are unchanged in this release. Unsupported
protocols and insufficient activity receive no numeric suspicion. New admission
snapshots require an assessment: insufficient activity fails the required-evidence
check; unsupported/broken model execution remains an assessment error. Archived controller rules cannot affect suspicion.

Classes receive equal total training mass. Within the automated class, confirmed
recordings receive 75% of the held-key head's mass and 90% of the pulse head's
mass; synthetic traces share the remainder. Within each source, recordings have
equal mass regardless of their window count or number of augmentations. This
prevents hundreds of synthetic seeds from overwhelming the small real dataset.

Held-key human groups include tempo and fixed-view nuisance projections. Pulse
human groups run those same observed key intentions through the client's finite
input-buffer increments, caps and draining, with six repeat-delay/rate/terminal
variants. These are nuisance probes from the original human, not new people or
complete physically valid games. Synthetic controllers are also projected through
that transport. Each head is calibrated separately by holding out an entire human
group, including all its projections, while retaining the same bot population and
source weights used in the final fit. The operating point is the greater of 0.9
or maximum held-out human support plus 0.02; values above 0.99 abort export.
Calibration folds do not provide an independent population false-positive rate.
The score is not a calibrated probability of human authenticity.

Ten controller families cover timed movement, periodic key refresh, reversing
correction, waypoint navigation, delayed/noisy waypoints, pursuit, PD steering,
nonlinear turns, timed macros and exact-distance motion. These are local control
simulations, not signed game credentials. They must never be uploaded as player
records. One quarter of seeds are reserved for testing. Separate development
checks hold out recorded source-family groups and related synthetic controller
lineages. Known-record fitting results are reported separately from held-out
measurements. Explicitly held-out new recordings stay out of training and human
calibration.

Export aborts if human calibration probes incur a deduction or a sufficiently
long, confirmed training bot is still missed. The exporter reports records too
short for behavioral assessment separately; deterministic game checks still apply
to them. Portable inference is compared with scikit-learn on both heads. Release
preflight repeats inference on Linux and rejudges authenticated original proofs.

There are only three independently confirmed human recordings. Pulse human
coverage is based on projections, so actual human macOS/Linux recordings remain
an important validation gap. Source-family and parameter comparisons are
calibration/development evidence. A controller that closely mimics human input
can still evade detection; neither fitting accuracy nor synthetic tests establish
universal detection or a population false-positive rate.
