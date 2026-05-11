export default function WaveDivider({ fill = "white" }) {
    return (
        <div style={{ width: '100%', overflow: 'hidden', height: '100px' }}>
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
            >
                <path
                    d="M0,50 Q300,10 600,50 T1200,50 L1200,150 L0,150 Z"
                    fill={fill}
                />
            </svg>
        </div>
    );
}